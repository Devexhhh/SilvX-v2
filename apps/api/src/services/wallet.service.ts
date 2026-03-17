import { prisma } from "@silvr/db"

export const getSilverBalance = async (userId: string) => {

    const entries = await prisma.ledgerEntry.aggregate({
        _sum: {
            amount: true
        },
        where: {
            account: `user:${userId}:silver`,
            asset: "SILVER"
        }
    })

    return entries._sum.amount || 0
}