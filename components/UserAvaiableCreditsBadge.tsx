"use client";

import { useQuery } from "@tanstack/react-query";
import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import Link from "next/link";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactCountUpWrapper from "./ReactCountUpWrapper";
import { buttonVariants } from "./ui/button";

export function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 1000 * 30,
  });

  return (
    <Link
      href={"/billing"}
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({ variant: "outline" })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="semibold capitalize">
        {query.isLoading && (
          <Loader2Icon size={20} className="w-4 h-4animate-spin" />
        )}
        {!query.isLoading && query.data && (
          <ReactCountUpWrapper value={query.data} />
        )}
        {!query.isLoading && query.data === undefined && "-"}
      </span>
    </Link>
  );
}

export default UserAvailableCreditsBadge;
