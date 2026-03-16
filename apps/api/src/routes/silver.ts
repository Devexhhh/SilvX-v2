import { Router } from "express"
import { buySilver } from "../services/silver.service"

export const silverRouter = Router()

silverRouter.post("/buy", buySilver)