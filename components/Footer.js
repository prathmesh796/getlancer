import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (

    <footer className='bg-black text-white flex h-21 py-7 px-10 mt-5 justify-between items-center bottom-0 static md:w-[100vw]'>
      <div className='flex flex-col sm:w-[100vw]'>

        <h2 className='text-2xl font-semibold'>Connect with us</h2>
        <ul className='flex gap-1 pt-1'>
          <li>
            <Link href='#' className='hover:text-yellow transition  flex-shrink-0'>
              <FontAwesomeIcon icon={faFacebook} style={{ fontSize: '1px', width: '33px' }} className='mr-6' />
            </Link>
          </li>

          <li>
            <Link href='#' className='hover:text-yellow transition  flex-shrink-0'>
            <FontAwesomeIcon icon={faXTwitter}  style={{ fontSize: '1px', width: '33px' }} className='mr-6' />
            </Link>
          </li>
          

          <li>
            <Link href='#' className='hover:text-yellow transition  flex-shrink-0'>
              <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '20px', width: '30px' }} className='mr-6' />
            </Link>
          </li>
        </ul>
      </div>


      <Link href='/' className='flex flex-col items-center justify-center sm:w-[100vw]'>

          <div className='flex items-center'>
            <h1 className='text-3xl font-bold'>getLancer</h1>
            <h4 className='text-light_yellow pt-2 font-semibold'>.com</h4>
          </div>
          <h1 className='text-gray-500 pt-4 text-sm'>All rights reserved | 2024</h1>
      </Link>

      <div className='sm:w-[100vw]'>
        <h3 className='font-medium'>
          <span className='text-sm font-semibold'>Our mail:</span> <br />
          <span className='text-yellow text-xl font-semibold'>xyz@gmail.com</span>
        </h3>
      </div> 

    </footer>
  );
};

export default Footer;
