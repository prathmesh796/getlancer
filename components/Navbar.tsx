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
    <nav className="flex h-24 justify-between bg-black px-10 py-4 text-white">
      <div className="flex outline-none">
        <h1 className="text-4xl font-bold">{activeTab}</h1>
      </div>

      <div className="mt-4 flex shrink-0 items-center justify-center gap-3 md:mt-0 md:gap-5">
        <Tab />
        {session ? (
          <div className="flex gap-5">
            <p className="text-light_yellow">Hello, {session.user.name}</p>
            <Link href={session.user.role === "Client" ? "/Cprofile" : "/Fprofile"}>
              <CgProfile className="h-8 w-8" />
            </Link>
            <Button
              variant="destructive"
              className="rounded-full bg-red-500 px-5 py-2 text-white hover:bg-red-600 md:p-3"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-5">
            <Link className="transition-all duration-200 hover:text-light_yellow" href="/login">
              Login
            </Link>
            <Button
              asChild
              className="rounded-full bg-yellow px-5 py-2 text-black hover:bg-light_yellow md:p-3"
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
