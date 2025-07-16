import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";

export default function SuccessState() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-green-400">
          Email Verified Successfully!
        </h2>
        <p className="text-muted-foreground">
          Your email address has been verified.
        </p>
      </div>

      <Badge
        variant="secondary"
        className="bg-green-500/10 text-green-400 border-green-500/20"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified
      </Badge>

      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          You can now access all features of your account.
        </p>
      </div>
    </div>
  );
}
