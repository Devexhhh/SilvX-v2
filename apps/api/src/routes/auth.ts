import { Router } from "express"
import { registerUser, loginUser } from "../services/auth.service"
import { validate } from "../middleware/validate.middleware"
import { registerSchema, loginSchema } from "../validators/auth.validator"
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware"

export const authRouter = Router()

authRouter.post(
    "/register",
    validate(registerSchema),
    async (req, res) => {

        const { email, password } = req.body

        const result = await registerUser(email, password)

        res.json(result)

    }
)

authRouter.post(
    "/login",
    rateLimitMiddleware,
    validate(loginSchema),
    async (req, res) => {

        const { email, password } = req.body

        const result = await loginUser(email, password)

        res.json(result)

    }
)