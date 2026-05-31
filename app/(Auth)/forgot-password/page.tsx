"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const Page = () => {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/reset-password')
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Please enter your email address to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email Address"
              required
            />
            <Button
              type="submit"
              className="w-full bg-yellow text-black hover:bg-light_yellow"
            >
              Request OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default Page
