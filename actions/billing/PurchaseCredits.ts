"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { string } from "zod";

export async function PurchaseCredits(packId: PackId) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    const selectedPack = getCreditsPack(packId);
    if (!selectedPack) {
        throw new Error("invalid pack");
    }

    const priceId = selectedPack.priceId;

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        invoice_creation: { enabled: true },
        success_url: getAppUrl("/billing/success"),
        cancel_url: getAppUrl("/billing/cancel"),
        metadata: {
            userId,
            packId,
        },
        line_items: [
            {
                price: priceId,
                quantity: 1,
            }
        ]
    });

    if (!session.url) {
        throw new Error("cannot create stripe session");
    }

    redirect(session.url);
}