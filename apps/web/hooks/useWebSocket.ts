import { useEffect } from "react"

export const useWebSocket = (onMessage: (data: any) => void) => {

    useEffect(() => {

        const token = localStorage.getItem("token") // or wherever you store JWT

        const ws = new WebSocket(`ws://localhost:4000?token=${token}`)

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            onMessage(data)
        }

        ws.onopen = () => {
            console.log("✅ WS connected")
        }

        ws.onclose = () => {
            console.log("❌ WS disconnected")
        }

        return () => ws.close()

    }, [])

}