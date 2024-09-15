import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='bg-black text-white flex h-100 py-5 px-10 justify-between'>
      <Link href='/' className='flex'>
        <h1 className='text-4xl font-bold'>getLancer</h1>
        <h4 className='text-light_yellow pt-4 font-medium'>.com</h4>
      </Link>

      <ul className='gap-4'>
        <Link href='/'>Home</Link>
        <Link href='/about'>About</Link>
        <Link href='/contact'>Contact</Link>
      </ul>

      <button className='rounded-full bg-yellow text-black font-semibold p-3'><Link href='/signin'>Signin/Login</Link></button>
    </nav>
  )
}

export default Navbar
