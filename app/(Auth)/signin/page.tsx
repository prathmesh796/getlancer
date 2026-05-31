"use client"
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { NextResponse } from 'next/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState("")

  const role = searchParams.get('role')
  const roleName =
    role === 'client' ? 'Client' : role === 'freelancer' ? 'Freelancer' : '';

  const isValidEmail = (email) => {
    const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !Name || !roleName) {
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
      const res = await fetch('/api/signin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name,
          email,
          password,
          roleName,
        }),
      })

      const data = await res.json();

      if (res.status === 400) {
        seterror('This email is already registeredd')
      }

      else if (res.status === 200) {
        seterror("")

        const loginResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginResult.ok) {
          if (roleName === "Client") {
            router.replace("/Cdash");
          } else {
            router.replace("/Fdash");
          }
        } else {
          router.push("/login");
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
    <div className='flex h-screen items-center justify-center bg-muted'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center text-3xl'>Sign in as a {roleName || '...'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label htmlFor='name' className='mb-2 block text-sm font-semibold'>
                Name
              </label>
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
              <label htmlFor='email' className='mb-2 block text-sm font-semibold'>
                Email Address
              </label>
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
              <label htmlFor='password' className='mb-2 block text-sm font-semibold'>
                Password
              </label>
              <Input
                type='password'
                id='password'
                className='h-11'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
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
  );
};

export default SignIn;
