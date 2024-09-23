"use client"
import { useState } from 'react';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add authentication logic here
    console.log({ email, password });
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Sign In</h2>
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
            Sign In
          </button>
        </form>
        <p className='text-center mt-6'>
          Don't have an account?{' '}
          <Link href='/signup' className='text-yellow font-semibold'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
