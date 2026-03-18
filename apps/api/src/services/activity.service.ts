import { prisma } from "@silvr/db"

export const createActivity = async (
    userId: string,
    type: "BUY" | "SELL" | "SIP" | "SYSTEM",
    message: string
) => {

    await prisma.activity.create({
        data: {
            userId,
            type,
            message
        }
    })

}