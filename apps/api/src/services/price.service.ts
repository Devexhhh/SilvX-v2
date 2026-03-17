import { redis } from "../lib/redis"

export const getSilverPrice = async () => {

    const price = await redis.get("silver_price")

    if (!price) {
        throw new Error("Silver price not available")
    }

    return parseFloat(price)
}