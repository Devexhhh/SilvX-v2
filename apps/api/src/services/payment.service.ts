import { razorpay } from "../lib/razorpay"

export const createSipSubscription = async (
    amount: number,
    frequency: "DAILY" | "WEEKLY" | "MONTHLY"
) => {

    let interval = 1
    let period: "daily" | "weekly" | "monthly" = "daily"

    if (frequency === "WEEKLY") period = "weekly"
    if (frequency === "MONTHLY") period = "monthly"

    const plan: any = await razorpay.plans.create({
        period,
        interval,
        item: {
            name: "Silver SIP",
            amount: amount * 100,
            currency: "INR"
        }
    })

    const subscription: any = await razorpay.subscriptions.create({
        plan_id: plan.id,
        customer_notify: 1,
        total_count: 1000
    })

    return subscription

}