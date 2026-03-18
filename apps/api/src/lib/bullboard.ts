import { ExpressAdapter } from "@bull-board/express"
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter"
import { sipQueue } from "./queue"

const serverAdapter = new ExpressAdapter()

createBullBoard({
    queues: [new BullMQAdapter(sipQueue)],
    serverAdapter
})

serverAdapter.setBasePath("/admin/queues")

export { serverAdapter }