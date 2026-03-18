import { prisma } from "@silvr/db"
import { getSilverPrice } from "./price.service"
import { checkIdempotency } from "./idempotency.service"
import { logger } from "../lib/logger"
import { eventBus } from "../lib/eventBus"
import { EVENTS } from "../events/events"
import { enqueueBuySettlement } from "./settlement.service"

export const buySilver = async (
    userId: string,
    amount: number,
    idempotencyKey: string
) => {

    const allowed = await checkIdempotency(idempotencyKey)

    if (!allowed) {

        logger.warn({
            event: "duplicate_request_blocked",
            idempotencyKey
        })

        return

    }

    const price = await getSilverPrice()

    const spread = 0.04
    const effectivePrice = price * (1 + spread)

    const grams = amount / effectivePrice

    logger.info({
        event: "silver_purchase_started",
        userId,
        amount,
        grams,
        price
    })

    /**
     * Database transaction
     * IMPORTANT: capture created transaction
     */
    const createdTx = await prisma.$transaction(async (tx) => {

        await tx.ledgerEntry.createMany({
            data: [
                {
                    account: `user:${userId}:silver`,
                    asset: "SILVER",
                    amount: grams,
                    reference: "BUY_SILVER"
                },
                {
                    account: "platform:silver",
                    asset: "SILVER",
                    amount: -grams,
                    reference: "BUY_SILVER"
                },
                {
                    account: `user:${userId}:cash`,
                    asset: "INR",
                    amount: -amount,
                    reference: "BUY_SILVER"
                },
                {
                    account: "platform:cash",
                    asset: "INR",
                    amount: amount,
                    reference: "BUY_SILVER"
                }
            ]
        })

        const transaction = await tx.transaction.create({
            data: {
                userId,
                amountINR: amount,
                silverGrams: grams,
                type: "BUY",
                status: "PENDING"
            }
        })

        return transaction
    })

    /**
     * Settlement job (use transactionId)
     */
    await enqueueBuySettlement(
        userId,
        amount,
        grams,
        idempotencyKey,
        createdTx.id
    )

    /**
     * Emit event (listeners handle activity + notifications)
     */
    eventBus.emit(EVENTS.SILVER_PURCHASED, {
        userId,
        amount,
        grams
    })

    logger.info({
        event: "silver_purchase_completed",
        userId,
        grams,
        transactionId: createdTx.id
    })

    return grams

}