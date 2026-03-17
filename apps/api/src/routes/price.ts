import { Router } from "express"
import { prisma } from "@silvr/db"

export const priceRouter = Router()

priceRouter.get("/history", async (req, res) => {

    const prices = await prisma.silverPrice.findMany({
        orderBy: {
            createdAt: "asc"
        },
        take: 500
    })

    res.json(prices)
})