import { WebSocketServer } from "ws"
import http from "http"
import jwt from "jsonwebtoken"

let wss: WebSocketServer

const clients: Map<string, Set<any>> = new Map()

export const initWebSocket = (server: http.Server) => {

    wss = new WebSocketServer({ server })

    wss.on("connection", (ws, req) => {

        try {

            const url = new URL(req.url!, "http://localhost")
            const token = url.searchParams.get("token")

            if (!token) {
                ws.close()
                return
            }

            const payload: any = jwt.verify(
                token,
                process.env.JWT_SECRET!
            )

            const userId = payload.userId

            if (!clients.has(userId)) {
                clients.set(userId, new Set())
            }

            clients.get(userId)!.add(ws)

            ws.on("close", () => {
                clients.get(userId)?.delete(ws)
            })

            ws.send(JSON.stringify({ type: "connected" }))

        } catch {
            ws.close()
        }

    })

}

/**
 * PUBLIC EVENTS
 */
export const broadcast = (data: any) => {

    if (!wss) return

    const payload = JSON.stringify(data)

    wss.clients.forEach((client: any) => {

        if (client.readyState === 1) {
            client.send(payload)
        }

    })

}

/**
 * PRIVATE USER EVENTS
 */
export const sendToUser = (
    userId: string,
    data: any
) => {

    const sockets = clients.get(userId)

    if (!sockets) return

    const payload = JSON.stringify(data)

    sockets.forEach((ws) => {

        if (ws.readyState === 1) {
            ws.send(payload)
        }

    })

}