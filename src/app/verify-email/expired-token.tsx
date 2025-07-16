import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Home } from "lucide-react";
import Link from "next/link";

export default function ExpiredToken() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20">
          <Clock className="h-8 w-8 text-orange-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-orange-400">
          Verification Link Expired
        </h2>
        <p className="text-muted-foreground">
          This verification link has expired. Verification links are valid for 2
          hours for security reasons.
        </p>
      </div>

      <div className="rounded-md bg-orange-500/10 border border-orange-500/20 p-3">
        <p className="text-sm text-orange-400">
          <Clock className="h-4 w-4 inline mr-1" />
          Link expired
        </p>
      </div>

      <Badge
        variant="secondary"
        className="bg-orange-500/10 text-orange-400 border-orange-500/20"
      >
        <Clock className="h-3 w-3 mr-1" />
        Expired
      </Badge>

      <div className="space-y-3">
        <Button variant="outline" asChild className="w-full bg-transparent">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
