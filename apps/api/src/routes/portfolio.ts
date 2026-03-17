import { Router } from "express"
import { getPortfolio } from "../services/portfolio.service"
import { authMiddleware } from "../middleware/auth.middleware"

export const portfolioRouter = Router()

portfolioRouter.get("/", authMiddleware, async (req, res) => {

    const userId = (req as any).userId

    const portfolio = await getPortfolio(userId)

    res.json(portfolio)

})