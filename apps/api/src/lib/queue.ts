import { Queue } from "bullmq"

export const connection = {
    host: "127.0.0.1",
    port: 6379
}

export const sipQueue = new Queue("sipQueue", {
    connection,
    defaultJobOptions: {
        attempts: 5,            // retry up to 5 times
        backoff: {
            type: "exponential",
            delay: 5000           // 5 seconds initial delay
        },
        removeOnComplete: true,
        removeOnFail: false
    }
})