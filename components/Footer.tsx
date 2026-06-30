import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className='bg-black text-white flex h-28 py-7 px-10 pl-20 mt-5 justify-between items-center bottom-0 static w-full'>
      <div className='flex flex-col sm:w-screen'>
        <h2 className='text-md font-normal'>Connect with us</h2>
        <ul className='flex justify-start gap-1 pt-1'>
          <li>
            <Link href='#' className='hover:text-yellow transition shrink-0'>
            <FontAwesomeIcon icon={faXTwitter}  style={{ fontSize: '1px', width: '30px', height: '20px' }}  />
            </Link>
          </li>
          <li>
            <Link href='#' className='hover:text-yellow transition shrink-0'>
              <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '20px', width: '30px', height: '20px' }} />
            </Link>
          </li>
        </ul>
      </div>

      <Link href='/' className='flex flex-col items-center justify-center sm:w-screen'>
          <div className='flex items-center'>
            <h1 className='text-3xl font-bold'>getLancer</h1>
            <h4 className='text-light_yellow pt-2 font-semibold'>.com</h4>
          </div>
          <h1 className='text-gray-500 pt-4 text-sm'>All rights reserved | 2026</h1>
      </Link>

      <div className='sm:w-screen flex justify-end'>
        <h3 className='font-medium'>
          <span className='text-sm font-normal'>Our mail:</span> <br />
          <span className='text-yellow text-md font-semibold'>getlancer796@gmail.com</span>
        </h3>
      </div> 
    </footer>
  );
};

export default Footer;
