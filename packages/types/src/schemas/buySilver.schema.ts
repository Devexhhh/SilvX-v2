import { z } from "zod"

export const buySilverSchema = z.object({
    userId: z.string().uuid(),
    amount: z.number().positive()
})

export type BuySilverInput = z.infer<typeof buySilverSchema>