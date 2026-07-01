"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import Tab from "@/components/theme-switch";
import { Button } from "@/components/ui/button";

const Navbar = (params: {activeTab: string}) => {
  const { activeTab } = params;
  const { data: session } = useSession();

  return (
    <nav className="flex flex-col md:flex-row h-auto md:h-24 justify-between items-center bg-black px-4 md:px-10 py-4 text-white gap-4 md:gap-0">
      <div className="flex outline-none">
        <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left">{activeTab}</h1>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-3 md:gap-5 w-full md:w-auto">
        <Tab />
        {session ? (
          <div className="flex items-center gap-3 md:gap-5">
            <p className="hidden sm:block text-light_yellow text-sm md:text-base">Hello, {session.user.name}</p>
            <Link href={session.user.role === "Client" ? "/Cprofile" : "/Fprofile"}>
              <CgProfile className="h-6 w-6 md:h-8 md:w-8" />
            </Link>
            <Button
              variant="destructive"
              className="rounded-full bg-red-500 px-4 py-2 text-sm md:text-base md:px-5 md:py-3 text-white hover:bg-red-600"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 md:gap-5">
            <Link className="text-sm md:text-base transition-all duration-200 hover:text-light_yellow" href="/login">
              Login
            </Link>
            <Button
              asChild
              className="rounded-full bg-yellow px-4 py-2 text-sm md:text-base md:px-5 md:py-3 text-black hover:bg-light_yellow"
            >
              <Link href="/join">Signin</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
