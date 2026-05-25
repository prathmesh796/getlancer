"use client";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const tokenRef = useRef('');

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = () => setTurnstileLoaded(true);
      document.body.appendChild(script);
    } else {
      setTurnstileLoaded(true); // Already loaded
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
    setError(""); // Reset error state

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

  // Turnstile rendering
  useEffect(() => {
    // Prevent double initialization
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
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-8 text-center">Log In</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div id="turnstile-container" className="my-4"></div>


          {/* Error Message Display */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-yellow text-black p-3 rounded-lg mt-4"
          >
            Log In
          </button>
        </form>

        <div>
          <button onClick={handleForgotPassword} className="text-yellow font-thin hover:underline">
            Forgot Password?
          </button>
        </div>

        <div className="text-center mt-4">
          <p>Or continue with:</p>
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 w-full border border-yellow p-3 rounded-lg mt-2"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Login with Google</span>
          </button>

          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-2 w-full border border-yellow p-3 rounded-lg mt-2"
          >
            <FaGithub className="w-6 h-6" />
            <span>Login with GitHub</span>
          </button>

        </div>

        <p className="text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signin" className="text-yellow font-thin hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
