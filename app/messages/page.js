
import React from 'react'
import Link from 'next/link'
import { IoMdAddCircleOutline } from "react-icons/io";
import Sidebar from '@/components/Sidebar';

const page = () => {
  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <Sidebar />
      
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-4xl font-semibold">Messages</h1>
            <div className="flex items-center space-x-4">
              <Link href="/NewMessage" className="flex justify-center items-center">
                <button className="flex bg-yellow m-10 px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200">
                  <IoMdAddCircleOutline className='w-6 h-6 mr-2' />New Message
                </button>
              </Link>
            </div>
          </div>
        </header>

        
      </main>
    </div>
  )
}

export default page
