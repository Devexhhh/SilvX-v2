import { Router } from "express"
import { buySilver } from "../services/silver.service"

export const silverRouter = Router()

silverRouter.post("/buy", async (req, res) => {

    const { userId, amount } = req.body

    const idempotencyKey = `manual-${Date.now()}-${userId}`

    const grams = await buySilver(
        userId,
        amount,
        idempotencyKey
    )

    res.json({
        success: true,
        grams
    })
})