import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='bg-black text-white flex h-100 py-5 px-10 justify-between'>
      <Link href='/' className='flex'>
        <h1 className='text-4xl font-bold'>getLancer</h1>
        <h4 className='text-light_yellow pt-4 font-medium'>.com</h4>
      </Link>

      <ul className='flex gap-8 items-center'>
        <li>
          <Link href='/' className='hover:text-yellow transition'>Home</Link>
        </li>
        <li>
          <Link href='/about' className='hover:text-yellow transition'>About</Link>
        </li>
        <li>
          <Link href='/contact' className='hover:text-yellow transition'>Contact</Link>
        </li>
      </ul>

      <button className='rounded-full bg-yellow text-black font-semibold p-3'><Link href='/signin'>Signin/Login</Link></button>
    </nav>
  )
}

export default Navbar
