"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession(); // Get session data

  return (
    <nav className="bg-black text-white flex h-100 py-8 px-10 justify-between ">
      <Link href="/" className="flex">
        <h1 className="text-5xl font-bold">getLancer</h1>
        <h4 className="text-light_yellow pt-6 font-semibold">.com</h4>
      </Link>

      <ul className="flex gap-8 items-center text-md">
        <li>
          <Link href="/" className="hover:text-light_yellow transition-all duration-200">Home</Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-light_yellow transition-all duration-200">About</Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-light_yellow transition-all duration-200">Contact</Link>
        </li>
      </ul>

      {/* Authentication Section */}
      <div className="flex gap-3 md:gap-5 justify-center items-center mt-4 md:mt-0 flex-shrink-0">
        {session ? (
          // If user is logged in, show Logout button
          <button
            className="rounded-full bg-yellow text-white px-5 py-2 md:p-3 hover:bg-light_yellow transition-all duration-200"
            onClick={() => signOut()}
          >
            Logout
          </button>
        ) : (
          // If user is NOT logged in, show Login & Signup buttons
          <>
            <Link className="hover:text-light_yellow transition-all duration-200" href="/login">
              Login
            </Link>
            <button className="rounded-full bg-yellow text-white px-5 py-2 md:p-3 hover:bg-light_yellow transition-all duration-200">
              <Link href="/join">Sign In</Link>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
