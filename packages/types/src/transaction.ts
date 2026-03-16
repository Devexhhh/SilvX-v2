export enum TransactionType {
    BUY = "BUY",
    SELL = "SELL",
    SIP = "SIP"
}

export interface Transaction {
    id: string
    userId: string
    amountINR: number
    silverGrams: number
    type: TransactionType
    createdAt: Date
}