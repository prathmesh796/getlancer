"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Banner from "@/components/Banner"

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const theme = useTheme();
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    if (session?.user?.role) {
      if (session.user.role === "Freelancer") {
        router.push("/Fdash");
      } else if (session.user.role === "Client") {
        router.push("/Cdash");
      }
    }
  }, [session, router]);

  useEffect(() => {
    setCurrentTheme(theme.theme)
  }, [theme.theme]);

  return (
    <div>
      <Banner />

      <main className='text-black mx-24 p-5'>
        <div className='flex justify-between px-10'>
          <div className='pt-24'>
            <h1 className='text-5xl font-semibold p-2'>Have <span className='text-yellow'>Skills...</span></h1>
            <h2 className='text-4xl font-normal p-2'>Lets get you paid...</h2>
            <Button asChild className='my-5 mx-2 rounded-full bg-yellow font-semibold text-black hover:bg-light_yellow'>
              <Link href='/signin'>Signin as Freelancer</Link>
            </Button>
          </div>
          <div className="img">
            <Image src={currentTheme === `light` ? `/home-img1.png` : `/home-img1-dark.png`} width={400} height={310} alt='freelancer-img' loading="eager" className="w-full h-auto" />
          </div>
        </div>

        <div className='mb-10 h-1 rounded-full opacity-15 bg-gray-400'></div>

        <div className='flex justify-between px-10'>
          <div className="img">
            <Image src={currentTheme === `light` ? `/home-img2.jpg` : `/home-img2-dark.png`} width={400} height={310} alt='freelancer-img' className="w-full h-auto" />
          </div>
          <div className='pt-20'>
            <h1 className='text-5xl font-semibold p-2'>Have <span className='text-yellow'>Company...</span></h1>
            <h2 className='text-4xl font-normal p-2'>Lets get you right talent...</h2>
            <Button asChild className='my-5 mx-2 rounded-full bg-yellow font-semibold text-black hover:bg-light_yellow'>
              <Link href='/signin'>Signin as Client</Link>
            </Button>
          </div>

        </div>


      </main>
    </div>
  );
}
