"use client";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const tokenRef = useRef('');

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.onload = () => setTurnstileLoaded(true);
    document.body.appendChild(script);

    // Set global callback
    window.onTurnstileSuccess = (token) => {
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
  }, [session?.status]);

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

      const userRole = session?.data?.user?.role;

      if (userRole === "Client") {
        router.replace("/Cdash");
      } else if (userRole === "Freelancer") {
        router.replace("/Fdash");
      } else {
        router.replace("/"); // fallback
      }
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {turnstileLoaded && (
            <div
              className="cf-turnstile"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              data-callback="onTurnstileSuccess"
            ></div>
          )}


          {/* Error Message Display */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-yellow text-black p-3 rounded-lg mt-4"
          >
            Log In
          </button>
        </form>

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
          Don't have an account?{" "}
          <Link href="/signin" className="text-yellow font-thin hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
