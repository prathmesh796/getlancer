import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import FButton from '@/components/Fbutton';
// import FDcard from '@/components/FDcard';
import Link from "next/link"
import { CDScard } from '@/components/CDScard';
import { CDMcard } from '@/components/CDMcard';
import { CDLcard } from '@/components/CDLcard';

export default function page() {
    return (
        <div className="flex h-screen bg-gray-100">
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
                        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <div className='p-3 rounded-md border border-gray-300  flex justify-start gap-2 items-center shadow-md w-[70vw] '>
                                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '20px' }} className='mr-6' />
                                <input
                                    type="text"
                                    // onChange={(e) => setQuery(e.target.value)}
                                    className="w-[70vw] border-gray-50 z-10  focus:outline-none" placeholder="Search for jobs..."
                                />
                            </div>
                            <FButton variant="ghost" size="icon">
                                <FontAwesomeIcon icon="fa-sharp fa-light fa-bell" />
                            </FButton>
                            <div id="dropdownNavbar" class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                                <ul class="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                                    </li>
                                </ul>
                                <div class="py-1">
                                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Overview Section */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <CDScard />
                        <CDScard />
                        <CDScard />
                        <CDScard />

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <CDMcard />
                        <CDMcard />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <CDLcard />

                    </div>


                </div>
            </main>
        </div >
    )
}
