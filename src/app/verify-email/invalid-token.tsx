import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, XCircle } from "lucide-react";
import Link from "next/link";

export default function InvalidToken() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-red-400">
          Invalid Verification Link
        </h2>
        <p className="text-muted-foreground">
          This verification link is invalid, malformed, or has already been
          used. Please request a new verification email.
        </p>
      </div>

      <Badge
        variant="destructive"
        className="bg-red-500/10 text-red-400 border-red-500/20"
      >
        <XCircle className="h-3 w-3 mr-1" />
        Invalid
      </Badge>

      <Button variant="outline" asChild className="w-full bg-transparent">
        <Link href="/">
          <Home className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Link>
      </Button>
    </div>
  );
}
