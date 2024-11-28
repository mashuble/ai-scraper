import "server-only";

import { stripe } from "@/lib/stripe/stripe";
import Stripe from "stripe";
import { writeFile } from "fs";
import { getCreditsPack, PackId } from "@/types/billing";
import prisma from "../prisma";

export async function handleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
    if (!event.metadata) {
        throw new Error("missing metadata");
    }

    const { userId, packId } = event.metadata;

    if (!userId || !packId) {
        throw new Error("missing metadata");
    }

    const purchasedPack = getCreditsPack(packId as PackId);

    if (!purchasedPack) {
        throw new Error("invalid pack id");
    }

    await prisma.userBalance.upsert({
        where: { userId },
        update: {
            balance: { 
                increment: purchasedPack.credits 
            },
        },
        create: { 
            userId, 
            balance: purchasedPack.credits 
        },
    });

    await prisma.userPurchase.create({
        data: {
            userId,
            stripeId: event.id,
            description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
            amount: event.amount_total!,
            currency: event.currency!,
        },
    });
}