import "dotenv/config"
import express from "express"
import cors from "cors"
import http from "http"
import { initWebSocket } from "./lib/wss"

import { sipRouter } from "./routes/sip"
import { serverAdapter } from "./lib/bullboard"
import pinoHttp from "pino-http"
import { logger } from "./lib/logger"
import { userRouter } from "./routes/user"
import { portfolioRouter } from "./routes/portfolio"
import { sellRouter } from "./routes/sell"
import { activityRouter } from "./routes/activity"
import { notificationRouter } from "./routes/notification"
import { authRouter } from "./routes/auth"
import { webhookRouter } from "./routes/webhook"
import { portfolioHistoryRouter } from "./routes/portfolioHistory"
import { scheduleRecovery } from "./queues/recovery.queue"
import { adminRouter } from "./routes/admin"

import "./events/activity.listener"
import "./events/notification.listener"


import "./workers/sip.worker"
import "./workers/price.worker"
import "./workers/sip.scheduler.worker"
import "./workers/settlement.worker"
import "./workers/recovery.worker"



const app = express()

const server = http.createServer(app)
initWebSocket(server)
scheduleRecovery()

app.use(pinoHttp({ logger }))
app.use(cors())
app.use(express.json())

app.use(
    "/webhook",
    express.raw({ type: "application/json" })
)

app.use("/auth", authRouter)
app.use("/portfolio", portfolioRouter)
app.use("/portfolio-history", portfolioHistoryRouter)
app.use("/admin", adminRouter)

app.use("/webhook", webhookRouter)

app.use("/sip", sipRouter)
app.use("/user", userRouter)
app.use("/sell", sellRouter)
app.use("/activity", activityRouter)
app.use("/notifications", notificationRouter)

app.use("/admin/queues", serverAdapter.getRouter())

app.get("/", (req, res) => {
    res.send("API running")
})

server.listen(4000, () => {
    console.log("API running on port 4000")
})