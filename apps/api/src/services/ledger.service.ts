import { prisma } from "@silvr/db"

export const createLedgerEntries = async (entries: {
    account: string
    asset: "INR" | "SILVER"
    amount: number
    reference: string
}[]) => {

    const total = entries.reduce((sum, e) => sum + e.amount, 0)

    if (Math.abs(total) > 0.00001) {
        throw new Error("Ledger not balanced")
    }

    await prisma.ledgerEntry.createMany({
        data: entries
    })
}