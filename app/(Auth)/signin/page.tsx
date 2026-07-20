"use client"
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { NextResponse } from 'next/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Banner from '@/components/Banner';

declare global {
  interface Window {
    turnstile: {
      render: (container: string, options: { sitekey: string, callback: (token: string) => void }) => void;
    };
    onTurnstileSuccess: (token: string) => void;
  }
}


const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState("")
  const tokenRef = useRef('');
  const widgetRendered = useRef(false);

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
    if (widgetRendered.current) return;
    widgetRendered.current = true;

    const renderTurnstile = () => {
      if (!window.turnstile) return;

      window.turnstile.render("#turnstile-container", {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
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

  const role = searchParams.get('role')

  const isValidEmail = (email: string) => {
    const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !Name || !role) {
      seterror('Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      seterror('This email is invalid')
      return;
    }

    if (password.length < 8) {
      seterror('The password must be greater than or equal to 8 characters')
      return;
    }

    try {
      console.log("Turnstile Token before /api/signin:", tokenRef.current);

      const res = await fetch('/api/signin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name,
          email,
          password,
          role,
        }),
      })

      const data = await res.json();

      if (res.status === 400) {
        seterror('This email is already registeredd')
      }

      else if (res.status === 200) {
        seterror("")

        console.log("Turnstile token passed to signIn:", tokenRef.current);
        const loginResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
          'cf-turnstile-response': tokenRef.current,
        });

        console.log("loginResult:", loginResult);

        if (loginResult?.ok) {
          if (role === "Client") {
            router.replace("/Cprofile/completeProfile");
          } else {
            router.replace("/Fprofile/completeProfile");
          }
        } else {
          console.error("signIn error:", loginResult?.error);
          seterror(loginResult?.error || 'Authentication failed after sign-in');
        }
      }
      else {
        seterror('An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error occurred during sign-in:', error);
      seterror('An unexpected error occurred. Please try again.');
      return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
  };

  return (
    <div className='flex-col h-screen items-center justify-center bg-muted'>
      <Banner />

      <div className='flex justify-center'>
        <Card className='w-full max-w-md m-5'>
          <CardHeader>
            <CardTitle className='text-center text-3xl'>Sign in as a {role || '...'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <Label htmlFor='name' className='mb-2 block text-sm font-semibold'>
                  Name
                </Label>
                <Input
                  type='text'
                  id='name'
                  className='h-11'
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor='email' className='mb-2 block text-sm font-semibold'>
                  Email Address
                </Label>
                <Input
                  type='email'
                  id='email'
                  className='h-11'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor='password' className='mb-2 block text-sm font-semibold'>
                  Password
                </Label>
                <Input
                  type='password'
                  id='password'
                  className='h-11'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div id="turnstile-container" className="my-4"></div>

              {error && <p className='text-destructive'>{error}</p>}
              <Button
                type='submit'
                className='h-11 w-full bg-yellow font-semibold text-black hover:bg-light_yellow'
              >
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className='justify-center'>
            <p>
              Already have an account?{' '}
              <Link href='/login' className='font-thin text-yellow hover:underline'>
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
