"use client";
import { Label } from "@radix-ui/react-label";
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
import { Separator } from "./ui/separator";
import PasswordInput from "./ui/password-input";
import { GoogleButton } from "./ui/google-button";
import { signupAction } from "@/lib/actions/actions";
import { useActionState } from "react";

export default function SignUpForm() {
  const [state, action, isPending] = useActionState(signupAction, {});
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
        <h2 className="text-3xl font-bold text-foreground">
          Create your account
        </h2>
        <p className="mt-2 text-muted-foreground">
          Start your journey with AI-powered note-taking
        </p>
      </div>
      {/* Signup Form */}
      <Card className="shadow-xl border-border">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center">Sign up</CardTitle>
          <CardDescription className="text-center">
            Create your account to start taking smarter notes
            {state.errors?.root && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-500">{state.errors.root}</p>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" action={action}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                min={1}
                max={64}
                required
                className={`h-11 ${
                  state.errors?.name ? "border-red-500" : ""
                } bg-background border-border focus:border-ring focus:ring-ring`}
                name="name"
                defaultValue={state.data?.name}
              />
              {state.errors?.name && (
                <p className="text-sm text-red-500">{state.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className={`h-11 ${
                  state.errors?.email ? "border-red-500" : ""
                } bg-background border-border focus:border-ring focus:ring-ring`}
                name="email"
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
                placeholder="Create a strong password"
                min={8}
                max={64}
                required
                className={`h-11 pr-10 bg-background border-border focus:border-ring focus:ring-ring ${
                  state.errors?.password ? "border-red-500" : ""
                }`}
                name="password"
                defaultValue={state.data?.password}
              />
              {state.errors?.password && (
                <p className="text-sm text-red-500">{state.errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm password
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your password"
                min={8}
                max={64}
                required
                className={`h-11 pr-10 bg-background border-border focus:border-ring focus:ring-ring ${
                  state.errors?.confirmPassword ? "border-red-500" : ""
                } `}
                name="confirmPassword"
                defaultValue={state.data?.confirmPassword}
              />
              {state.errors?.confirmPassword && (
                <p className="text-sm text-red-500">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full cursor-pointer h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
            >
              Create account
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

      {/* Login link */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
