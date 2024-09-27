import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className='w-[100vw] bg-black text-white flex flex-col md:flex-row h-auto md:h-100 py-4 md:py-8 px-5 md:px-10 justify-between items-center w-full'>
      {/* Logo Section */}
      <Link href='/' className='flex items-center flex-shrink-0'>
        <h1 className='text-3xl md:text-5xl font-bold'>getLancer</h1>
        <h4 className='text-light_yellow pt-1 md:pt-6 font-semibold text-xl md:text-2xl'>.com</h4>
      </Link>

      {/* Navigation Links */}
      <ul className='flex  md:flex-row gap-4 md:gap-8 items-center mt-4 md:mt-0'>
        <li>
          <Link href='/' className='hover:text-light_yellow transition-all duration-200'>Home</Link>
        </li>
        <li>
          <Link href='/about' className='hover:text-light_yellow transition-all duration-200'>About</Link>
        </li>
        <li>
          <Link href='/contact' className='hover:text-light_yellow transition-all duration-200'>Contact</Link>
        </li>
      </ul>

      {/* Auth Section */}
      <div className='flex gap-3 md:gap-5 justify-center items-center mt-4 md:mt-0 flex-shrink-0'>
        <Link className='hover:text-light_yellow transition-all duration-200' href='/login'>Login</Link>
        <button className='rounded-full bg-yellow text-black px-5 py-2 md:p-3 hover:bg-light_yellow transition-all duration-200'>
          <Link href='/join'>Signin</Link>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
