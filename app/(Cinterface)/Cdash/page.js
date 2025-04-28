import React from 'react'
import { IoMdAddCircleOutline } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link"
import CJobs from '@/components/CJobs';

export default function page() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>
                <nav className="space-y-2">

                    <Link
                        href="#"
                        className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
                    >
                        {/* <Layout className="h-5 w-5" /> */}
                        <span>Dashboard</span>
                    </Link>
                    <Link href="#" className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg">
                        {/* <MessageSquare className="h-5 w-5" /> */}
                        <span>Messages</span>
                    </Link>
                    <Link href="#" className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg">
                        {/* <Calendar className="h-5 w-5" /> */}
                        <span>Schedule</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-4xl font-semibold text-gray-900">Let's get Some work done...</h1>
                        <div className="flex items-center space-x-4">
                            <button className="flex bg-yellow m-10 text-black px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200"><IoMdAddCircleOutline className='w-6 h-6 mr-2' />Post New Job</button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
                    <div className='m-4 p-2 rounded-full border border-gray-300  flex justify-center gap-2 items-center shadow-md w-2/3 '>
                        <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '30px', height: '30px' }} className='mr-6' />
                        <input
                            type="text"
                            //onChange={(e) => setQuery(e.target.value)}
                            className="w-full border-gray-50 z-10  focus:outline-none" placeholder="Search your jobs..."
                        />

                        <select name="JobStatus" id="" className='px-4 py-2 rounded-full border border-gray-300 focus:outline-none'>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    {/* Overview Section */}
                    <div className="flex flex-row gap-4 w-full">
                        <CJobs/>

                    </div>
                </div>
            </main>
        </div >
    )
}
