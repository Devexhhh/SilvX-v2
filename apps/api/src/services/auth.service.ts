import bcrypt from "bcryptjs"
import { prisma } from "@silvr/db"
import { signToken } from "../lib/jwt"

export const registerUser = async (
    email: string,
    password: string
) => {

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        }
    })

    const token = signToken(user.id)

    return { user, token }

}

export const loginUser = async (
    email: string,
    password: string
) => {

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw new Error("Invalid credentials")
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
        throw new Error("Invalid credentials")
    }

    const token = signToken(user.id)

    return { user, token }

}