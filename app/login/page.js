"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session?.status === "authenticated") {
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
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    if (res?.ok) {
      setError("");
      router.replace("/Fdash");
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

          {/* Error Message Display */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-yellow text-black p-3 rounded-lg font-semibold mt-4"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <p>Or continue with:</p>
          <button
            onClick={() => signIn("google")}
            className="w-full bg-red-500 text-white p-3 rounded-lg mt-2"
          >
            Login with Google
          </button>
          <button
            onClick={() => signIn("github")}
            className="w-full bg-gray-800 text-white p-3 rounded-lg mt-2"
          >
            Login with GitHub
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
