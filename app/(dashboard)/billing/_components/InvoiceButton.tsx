"use client";

import { DownloadInvoice } from "@/actions/billing/DownloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { File, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function InvoiceButton({ id }: { id: string }) {
    const mutation = useMutation({
        mutationFn: DownloadInvoice,
        onSuccess: (data) => (window.location.href = data as string),
        onError: () => toast.error("Failed to download invoice"),
    })

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-2 text-muted-foreground px-1"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(id)}
        >
            {mutation.isPending ? <Loader2Icon size={16} className="animate-spin" /> : <File size={16} />}
            Invoice
        </Button>
    )
}