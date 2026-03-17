import { Router } from "express"
import { createSipPlan } from "../services/sip.service"
import { validate } from "../middleware/validate.middleware"
import { createSipSchema } from "../validators/sip.validator"
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware"
import { authMiddleware } from "../middleware/auth.middleware"
import { createSipSubscription } from "../services/payment.service"

export const sipRouter = Router()


sipRouter.post(
    "/create",
    authMiddleware,
    validate(createSipSchema),
    async (req, res) => {

        const userId = (req as any).userId
        const { amount, frequency } = req.body

        const subscription = await createSipSubscription(
            amount,
            frequency
        )

        res.json({
            subscriptionId: subscription.id
        })

    }
)