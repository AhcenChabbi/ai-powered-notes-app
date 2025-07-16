import { Home, Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function MissingTokenQueryParam() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
          <Mail className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Invalid Verification Link</h2>
        <p className="text-muted-foreground">
          This verification link is missing required parameters. Please use the
          complete link from your email or request a new one.
        </p>
      </div>

      <div className="rounded-md bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <h3 className="text-sm font-medium text-blue-400">
              Check your email
            </h3>
            <p className="text-sm text-blue-300/80 mt-1">
              Look for the verification email and click the complete
              verification link.
            </p>
          </div>
        </div>
      </div>

      <Button variant="outline" asChild className="w-full bg-transparent">
        <Link href="/">
          <Home className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Link>
      </Button>
    </div>
  );
}
