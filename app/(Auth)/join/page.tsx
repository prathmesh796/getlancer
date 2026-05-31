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
    <div className="m-10 flex flex-col items-center justify-center bg-background">
      <h1 className="m-10 mb-8 text-3xl font-bold">Join our website</h1>

      <div className="m-10 mb-8 flex gap-24 space-x-10">
        <Card
          className={cn(
            "flex h-48 w-64 cursor-pointer flex-col items-center justify-center border-2 p-8",
            selectedAccount === 'client' ? 'border-foreground' : 'border-muted'
          )}
          onClick={() => handleSelection('client')}
        >
          <CardContent className="flex flex-col items-center justify-center p-0">
            <input
              type="radio"
              name="accountType"
              className="mb-4 h-6 w-6 cursor-pointer"
              checked={selectedAccount === 'client'}
              onChange={() => handleSelection('client')}
            />
            <span className="text-center text-xl">Sign in as a Client</span>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "flex h-48 w-64 cursor-pointer flex-col items-center justify-center border-2 p-8",
            selectedAccount === 'freelancer' ? 'border-foreground' : 'border-muted'
          )}
          onClick={() => handleSelection('freelancer')}
        >
          <CardContent className="flex flex-col items-center justify-center p-0">
            <input
              type="radio"
              name="accountType"
              className="mb-4 h-6 w-6 cursor-pointer"
              checked={selectedAccount === 'freelancer'}
              onChange={() => handleSelection('freelancer')}
            />
            <span className="text-center text-xl">Sign in as a Freelancer</span>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleCreateAccount}
        className="m-10 rounded-full bg-yellow text-black hover:bg-light_yellow"
      >
        Create Account
      </Button>

      <p className="mt-6 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-sm text-yellow hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default AccountTypeSelection;
