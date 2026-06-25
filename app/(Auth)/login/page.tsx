"use client";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ForgotPasswordDialog } from "@/components/auth/forgotPassword";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

declare global {
  interface Window {
    turnstile: {
      render: (container: string, options: { sitekey: string, callback: (token: string) => void }) => void;
    };
    onTurnstileSuccess: (token: string) => void;
    __turnstileRendered: boolean;
  }
}

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const tokenRef = useRef('');

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onTurnstileSuccess = (token: string) => {
      tokenRef.current = token;
    };

    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  useEffect(() => {
    const userRole = session?.data?.user?.role;

    if (userRole === "Client") {
      router.replace("/Cdash");
    } else if (userRole === "Freelancer") {
      router.replace("/Fdash");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      'cf-turnstile-response': tokenRef.current,
    });

    if (res?.error === "UserNotFound") {
      router.replace("/join");
      setError("User not found. Please sign up.");
      return;
    }

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    if (res?.ok) {
      setError("");

      let userRole;
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const freshSession = await getSession();
        userRole = freshSession?.user?.role;
        if (userRole) break;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      if (userRole === "Client") {
        router.replace("/Cdash");
      } else if (userRole === "Freelancer") {
        router.replace("/Fdash");
      } else {
        router.replace("/");
      }
    }
  };

  useEffect(() => {
    if (window.__turnstileRendered) return;
    window.__turnstileRendered = true;

    const renderTurnstile = () => {
      if (!window.turnstile) return;

      window.turnstile.render("#turnstile-container", {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token) => (tokenRef.current = token),
      });
    };

    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = renderTurnstile;
      document.body.appendChild(script);
    } else {
      renderTurnstile();
    }
  }, []);

  const handleForgotPassword = async () => {
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.status === 200) {
      alert(data.message);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div id="turnstile-container" className="my-4"></div>

            {error && <p className="text-center text-destructive">{error}</p>}

            <Button
              type="submit"
              className="h-11 w-full bg-yellow text-black hover:bg-light_yellow"
            >
              Log In
            </Button>
          </form>

          <ForgotPasswordDialog />

          <CardDescription className="mt-4 text-center">Or continue with:</CardDescription>
          <div className="mt-2 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-yellow"
              onClick={() => signIn("google")}
            >
              <FcGoogle className="size-6" />
              Login with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-yellow"
              onClick={() => signIn("github")}
            >
              <FaGithub className="size-6" />
              Login with GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signin" className="font-thin text-yellow hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
