import { z } from "zod"

export const createSipSchema = z.object({
    amount: z.number().positive(),
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"])
})