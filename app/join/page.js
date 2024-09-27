"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AccountTypeSelection = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const router = useRouter();

  const handleSelection = (accountType) => {
    setSelectedAccount(accountType);
  };

  const handleCreateAccount = () => {
    if (selectedAccount) {
      // Navigate to the signin page with the selected role as a query parameter
      router.push(`/signin?role=${selectedAccount}`);
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center m-10 bg-white">
      <h1 className="text-3xl font-bold mb-8 m-10">Join our website</h1>
      
        <div className="flex space-x-10 mb-8 m-10 gap-24">
          <div
            className={`p-8 w-64 h-48 flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer ${selectedAccount === 'client' ? 'border-black' : 'border-gray-300'
              }`}
            onClick={() => handleSelection('client')}
          >
            <input
              type="radio"
              name="accountType"
              className="mb-4 w-6 h-6 cursor-pointer"
              checked={selectedAccount === 'client'}
              onChange={() => handleSelection('client')}
            />
            <span className="text-xl text-center">Sign in as a Client</span>
          </div>

          <div
            className={`p-8 w-64 h-48 flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer ${selectedAccount === 'freelancer' ? 'border-black' : 'border-gray-300'
              }`}
            onClick={() => handleSelection('freelancer')}>
            <input
              type="radio"
              name="accountType"
              className="mb-4 w-6 h-6 cursor-pointer"
              checked={selectedAccount === 'freelancer'}
              onChange={() => handleSelection('freelancer')}
            />
            <span className="text-xl text-center">Sign in as a Freelancer</span>
          </div>
        </div>

        <button onClick={handleCreateAccount} className="bg-yellow m-10 text-black px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200">
          <Link href='/signin'>Create Account</Link>
        </button>
      

      <p className="mt-6 text-sm ">
        Already have an account?{' '}
        <Link href="/login" className="text-yellow text-sm hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default AccountTypeSelection;

