"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { verifyUser } from "@/actions/userActions";

interface VerificationButtonProps {
  userId: string;
}

export function VerificationButton({ userId }: VerificationButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    // startTransition allows us to handle the async server action
    // and show a loading state without a manual "loading" state variable
    startTransition(async () => {
      const result = await verifyUser(userId);

      if (result.success) {
        toast.success("Identity Verified", {
          description: "The operator has been granted full system access.",
        });
      } else {
        toast.error("Process Failed", {
          description: result.error || "An error occurred during verification.",
        });
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleVerify}
      disabled={isPending}
      className="h-8 border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition-all hover:bg-indigo-600 hover:text-white group cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
      ) : (
        <UserCheck className="mr-2 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {isPending ? "Syncing..." : "Approve User"}
      </span>
    </Button>
  );
}