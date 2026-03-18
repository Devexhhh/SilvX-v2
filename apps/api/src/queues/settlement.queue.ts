import { Queue } from "bullmq"
import { redis } from "../lib/redis"

export const settlementQueue = new Queue(
    "settlementQueue",
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
)