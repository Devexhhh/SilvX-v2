import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const buySilver = async (req: Request, res: Response) => {

    const { userId, amount } = req.body

    const silverPrice = 100 // mock price per gram
    const spread = 0.04

    const effectivePrice = silverPrice * (1 + spread)

    const grams = amount / effectivePrice

    const tx = await prisma.transaction.create({
        data: {
            userId,
            amount,
            silverGrams: grams,
            type: "BUY"
        }
    })

    res.json(tx)
}