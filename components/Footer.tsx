import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className='bg-black text-white flex flex-col md:flex-row h-auto md:h-28 py-8 px-4 md:px-10 mt-5 justify-between items-center gap-6 md:gap-0 w-full'>
      <div className='flex flex-col items-center md:items-start text-center md:text-left'>
        <h2 className='text-md font-normal'>Connect with us</h2>
        <ul className='flex justify-center md:justify-start gap-1 pt-1'>
          <li>
            <Link href='#' aria-label="Twitter" className='hover:text-yellow transition shrink-0'>
            <FontAwesomeIcon icon={faXTwitter}  style={{ fontSize: '1px', width: '30px', height: '20px' }}  />
            </Link>
          </li>
          <li>
            <Link href='#' aria-label="LinkedIn" className='hover:text-yellow transition shrink-0'>
              <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '20px', width: '30px', height: '20px' }} />
            </Link>
          </li>
        </ul>
      </div>

      <Link href='/' className='flex flex-col items-center justify-center'>
          <div className='flex items-center'>
            <span className='text-2xl md:text-3xl font-bold'>getLancer</span>
            <span className='text-light_yellow pt-1 md:pt-2 font-semibold text-sm md:text-base'>.com</span>
          </div>
          <p className='text-gray-400 pt-2 text-xs md:text-sm'>All rights reserved | 2026</p>
      </Link>

      <div className='flex justify-center md:justify-end text-center md:text-right'>
        <p className='font-medium'>
          <span className='text-sm font-normal'>Our mail:</span> <br />
          <span className='text-yellow text-sm md:text-base font-semibold'>getlancer796@gmail.com</span>
        </p>
      </div> 
    </footer>
  );
};

export default Footer;
