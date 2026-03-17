import { prisma } from "@silvr/db"
import { logger } from "../lib/logger"

export const createSipPlan = async (
    userId: string,
    amount: number,
    frequency: "DAILY" | "WEEKLY" | "MONTHLY"
) => {

    const now = new Date()

    const nextRun = new Date(now)

    if (frequency === "DAILY") {
        nextRun.setDate(now.getDate() + 1)
    }

    if (frequency === "WEEKLY") {
        nextRun.setDate(now.getDate() + 7)
    }

    if (frequency === "MONTHLY") {
        nextRun.setMonth(now.getMonth() + 1)
    }

    const sip = await prisma.sIPPlan.create({
        data: {
            userId,
            amount,
            frequency,
            nextRun
        }
    })

    logger.info({
        event: "sip_created",
        sipId: sip.id,
        userId,
        amount,
        frequency
    })

    return sip
}