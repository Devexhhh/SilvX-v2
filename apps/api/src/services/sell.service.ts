import { prisma } from "@silvr/db"
import { getSilverPrice } from "./price.service"
import { checkIdempotency } from "./idempotency.service"
import { logger } from "../lib/logger"
import { eventBus } from "../lib/eventBus"
import { EVENTS } from "../events/events"
import { enqueueSellSettlement } from "./settlement.service"

export const sellSilver = async (
    userId: string,
    gramsToSell: number,
    idempotencyKey: string
) => {

    const allowed = await checkIdempotency(idempotencyKey)

    if (!allowed) {

        logger.warn({
            event: "duplicate_sell_blocked",
            idempotencyKey
        })

        return

    }

    const price = await getSilverPrice()
    const valueINR = gramsToSell * price

    /**
     * Check user balance
     */
    const balance = await prisma.ledgerEntry.aggregate({
        where: {
            account: `user:${userId}:silver`
        },
        _sum: {
            amount: true
        }
    })

    const totalGrams = balance._sum.amount || 0

    if (gramsToSell > totalGrams) {
        throw new Error("Insufficient silver balance")
    }

    logger.info({
        event: "silver_sell_started",
        userId,
        grams: gramsToSell,
        valueINR
    })

    /**
     * Database transaction
     * IMPORTANT: capture transaction
     */
    const createdTx = await prisma.$transaction(async (tx) => {

        await tx.ledgerEntry.createMany({
            data: [
                {
                    account: `user:${userId}:silver`,
                    asset: "SILVER",
                    amount: -gramsToSell,
                    reference: "SELL_SILVER"
                },
                {
                    account: "platform:silver",
                    asset: "SILVER",
                    amount: gramsToSell,
                    reference: "SELL_SILVER"
                },
                {
                    account: `user:${userId}:cash`,
                    asset: "INR",
                    amount: valueINR,
                    reference: "SELL_SILVER"
                },
                {
                    account: "platform:cash",
                    asset: "INR",
                    amount: -valueINR,
                    reference: "SELL_SILVER"
                }
            ]
        })

        const transaction = await tx.transaction.create({
            data: {
                userId,
                amountINR: valueINR,
                silverGrams: gramsToSell,
                type: "SELL",
                status: "PENDING"
            }
        })

        return transaction
    })

    /**
     * Settlement job (pass transactionId)
     */
    await enqueueSellSettlement(
        userId,
        gramsToSell,
        idempotencyKey,
        createdTx.id
    )

    /**
     * Emit event (listeners handle activity + notifications)
     */
    eventBus.emit(EVENTS.SILVER_SOLD, {
        userId,
        grams: gramsToSell,
        valueINR
    })

    logger.info({
        event: "silver_sold",
        userId,
        grams: gramsToSell,
        valueINR,
        transactionId: createdTx.id
    })

    return {
        gramsSold: gramsToSell,
        amountReceived: valueINR
    }

}