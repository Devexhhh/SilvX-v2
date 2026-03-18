import { prisma } from "@silvr/db"
import { logger } from "../lib/logger"

export const allocateSilver = async (
    userId: string,
    grams: number,
    referenceId: string
) => {

    try {

        /**
         * MOCK external API call (Augmont)
         * Replace this with real HTTP call later
         */
        const externalId = "aug_" + Date.now()

        const record = await prisma.custodyTransaction.create({
            data: {
                userId,
                provider: "AUGMONT",
                externalId,
                metal: "SILVER",
                grams,
                status: "ALLOCATED"
            }
        })

        logger.info({
            event: "custody_allocated",
            userId,
            grams,
            externalId
        })

        return record

    } catch (error: any) {

        logger.error({
            event: "custody_failed",
            userId,
            grams,
            error: error.message
        })

        throw error
    }

}