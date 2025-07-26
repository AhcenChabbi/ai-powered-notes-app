"use client";
import { Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import PasswordInput from "./ui/password-input";
import { useActionState, useEffect } from "react";
import { loginAction } from "@/lib/actions/actions";
import { GoogleButton } from "./ui/google-button";
import { toast } from "sonner";
import { redirect } from "next/navigation";
export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, {});
  useEffect(() => {
    if (state.successMessage) {
      toast.success(state.successMessage);
      redirect("/dashboard");
    }
    if (state.errors?.root) {
      toast.error(state.errors.root);
    }
  }, [state]);
  return (
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 mb-6"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">AI Notes</span>
        </Link>
        <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
        <p className="mt-2 text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Form */}
      <Card className="shadow-xl border-border">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center text-foreground">
            Sign in
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your email and password to access your notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                min={1}
                max={64}
                placeholder="Enter your email"
                required
                className={`${
                  state.errors?.email && "border-red-500"
                } h-11 bg-background border-border focus:border-ring focus:ring-ring`}
                defaultValue={state.data?.email}
              />
              {state.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                name="password"
                min={8}
                max={64}
                required
                className={`h-11 pr-10 bg-background border-border focus:border-ring focus:ring-ring ${
                  state.errors?.password && "border-red-500"
                }`}
                defaultValue={state.data?.password}
              />
              {state.errors?.password && (
                <p className="text-sm text-red-500">{state.errors.password}</p>
              )}
            </div>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer"
            >
              Sign in
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleButton />
        </CardContent>
      </Card>

      {/* Sign up link */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-white hover:underline font-medium"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
