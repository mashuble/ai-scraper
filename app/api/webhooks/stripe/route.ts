import { handleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("stripe-signature")! as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            endpointSecret
        );

        switch (event.type) {
            case "checkout.session.completed":
                handleCheckoutSessionCompleted(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("stripe webhook error", error);
        return new NextResponse("Webhook error", { status: 400 });
    }
}