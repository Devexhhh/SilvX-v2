import { prisma } from "@silvr/db"

export const checkIdempotency = async (key: string) => {

    const existing = await prisma.idempotencyKey.findUnique({
        where: { id: key }
    })

    if (existing) {
        return false
    }

    await prisma.idempotencyKey.create({
        data: { id: key }
    })

    return true
}