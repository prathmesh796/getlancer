"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AccountTypeSelection = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const router = useRouter();

  const handleSelection = (accountType: string) => {
    setSelectedAccount(accountType);
  };

  const handleCreateAccount = () => {
    if (selectedAccount) {
      router.push(`/signin?role=${selectedAccount}`);
    }
  };

  return (
    <div className="m-4 md:m-10 flex flex-col items-center justify-center bg-background min-h-[70vh]">
      <h1 className="m-6 md:m-10 mb-8 text-2xl md:text-3xl font-bold text-center">Join our website</h1>

      <div className="m-4 md:m-10 mb-8 flex flex-col md:flex-row gap-6 md:gap-16 w-full max-w-2xl justify-center items-center">
        <Card
          className={cn(
            "flex h-48 w-full md:w-64 cursor-pointer flex-col items-center justify-center border-2 p-8 transition-all duration-200",
            selectedAccount === 'Client' ? 'border-foreground shadow-lg scale-105' : 'border-muted hover:border-gray-400'
          )}
          onClick={() => handleSelection('Client')}
        >
          <CardContent className="flex flex-col items-center justify-center p-0">
            <input
              type="radio"
              name="accountType"
              className="mb-4 h-6 w-6 cursor-pointer"
              checked={selectedAccount === 'Client'}
              onChange={() => handleSelection('Client')}
            />
            <span className="text-center text-lg md:text-xl">Sign in as a Client</span>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "flex h-48 w-full md:w-64 cursor-pointer flex-col items-center justify-center border-2 p-8 transition-all duration-200",
            selectedAccount === 'Freelancer' ? 'border-foreground shadow-lg scale-105' : 'border-muted hover:border-gray-400'
          )}
          onClick={() => handleSelection('Freelancer')}
        >
          <CardContent className="flex flex-col items-center justify-center p-0">
            <input
              type="radio"
              name="accountType"
              className="mb-4 h-6 w-6 cursor-pointer"
              checked={selectedAccount === 'Freelancer'}
              onChange={() => handleSelection('Freelancer')}
            />
            <span className="text-center text-lg md:text-xl">Sign in as a Freelancer</span>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleCreateAccount}
        className="m-6 md:m-10 rounded-full bg-yellow px-8 py-4 text-black hover:bg-light_yellow text-base md:text-lg"
      >
        Create Account
      </Button>

      <p className="mt-2 md:mt-6 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-sm text-yellow hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default AccountTypeSelection;
