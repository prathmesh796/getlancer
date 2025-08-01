import React from 'react'

const page = () => {
  return (
    <main className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="mb-4">Please enter your new password.</p>
      <form>
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 rounded mb-4 w-full"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="border p-2 rounded mb-4 w-full"
        />
        <button type="submit" className="bg-yellow text-black p-2 rounded">
          Reset Password
        </button>
      </form>
    </main>
  )
}

export default page
