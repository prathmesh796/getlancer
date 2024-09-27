"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import fa from 'fontawesome';

const login = () => {
  const router = useRouter()
  const session = useSession()
  const [error, seterror] = useState("")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if(session?.status === 'authenticated'){
      router.replace('/dashboard')
    }
  }, [session, router])
  

  const isValidEmail = (email) => {
    const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can add authentication logic here
    console.log({ email, password });

    if (!email || !password) {
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

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password
    })

    if (res?.error) {
      seterror("Invalid email or password")

      if (res?.url) router.replace("/dashboard")
    }
    else {
      seterror("")
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-white'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label htmlFor='email' className='block text-sm font-semibold mb-2'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-semibold mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-yellow text-black p-3 rounded-lg font-semibold'
          >
            Log In
          </button>
        </form>
        <p className='text-center mt-6'>
          Don't have an account?{' '}
          <Link href='/signin' className='text-yellow font-thin hover:underline'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default login;
