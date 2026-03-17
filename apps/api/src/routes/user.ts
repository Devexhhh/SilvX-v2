import { Router } from "express"
import { prisma } from "@silvr/db"

export const userRouter = Router()

userRouter.post("/create", async (req, res) => {

    const { email } = req.body

    const user = await prisma.user.create({
        data: { email }
    })

    res.json(user)
})