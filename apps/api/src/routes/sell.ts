import { Router } from "express"
import { sellSilver } from "../services/sell.service"
import { validate } from "../middleware/validate.middleware"
import { sellSchema } from "../validators/sell.validator"
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware"

export const sellRouter = Router()

sellRouter.post(
    "/",
    rateLimitMiddleware,
    validate(sellSchema),
    async (req, res) => {

        const userId = (req as any).userId

        const { grams } = req.body

        const idempotencyKey = `sell-${Date.now()}-${userId}`

        const result = await sellSilver(
            userId,
            grams,
            idempotencyKey
        )

        res.json(result)

    }
)