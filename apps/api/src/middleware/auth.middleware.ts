import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../lib/jwt"

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: "Missing token" })
    }

    const token = authHeader.split(" ")[1]

    try {

        const payload = verifyToken(token)

            ; (req as any).userId = payload.userId

        next()

    } catch {

        return res.status(401).json({ error: "Invalid token" })

    }

}