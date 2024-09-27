"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [roleName, setRoleName] = useState("");
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, seterror] = useState("")

  const role = searchParams.get('role')
  console.log(role)

  useEffect(() => {
    if (role === 'client') {
      setRoleName('Client');
    } else if (role === 'freelancer') {
      setRoleName('Freelancer');
    }
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
    return emailRegex.test(email)
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can add authentication logic here
    console.log({ Name, email, password, roleName });

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
        router.push('/login')
      }
      else {
        seterror('An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error occurred during sign-in:', error);
      seterror('An unexpected error occurred. Please try again.');
      return NextResponse.json({error: error.message, stack: error.stack}, {status: 500});
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-3xl font-bold mb-8 text-center'>Sign in as a {roleName || '...'}</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label htmlFor='name' className='block text-sm font-semibold mb-2'>
              Name
            </label>
            <input
              type='name'
              id='name'
              className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow'
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <p className='text-red-500'>{error && error}</p>
        </form>
        <p className='text-center mt-6'>
          Already have an account?{' '}
          <Link href='/login' className='text-yellow font-thin hover:underline'>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
