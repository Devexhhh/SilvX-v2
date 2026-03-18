import { z } from "zod"

export const sellSchema = z.object({
    grams: z.number().positive()
})