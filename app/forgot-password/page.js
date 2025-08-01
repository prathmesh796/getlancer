"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()

    

    router.push('/reset-password')
  }

  return (
    <main className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="mb-4">Please enter your email address to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          className="border p-2 rounded mb-4 w-full"
        />
        <button type="submit" className="bg-yellow text-black p-2 rounded">
          Request OTP
        </button>
      </form>
    </main>
  )
}

export default page
