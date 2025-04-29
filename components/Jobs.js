import React from 'react'
import Image from 'next/image'

const Jobs = () => {
    return (
        <div className='flex justify-between items-center border border-gray-300 rounded-md shadow-md p-4 m-4'>
            <div className='flex items-center gap-4'>
                <Image src="/office-building.jpg" alt="Company Logo" width={100} height={100} />
                <div className='flex flex-col'>
                    <h2 className='text-xl font-semibold'>Company Name</h2>
                    <p className='text-gray-600'>Location</p>
                </div>
            </div>

            <div className='w-2/3 p-4'>
                <h2 className='text-2xl font-semibold mb-4'>Job Title</h2>
                <p className='text-gray-600'>Job description goes here...</p>
            </div>

            <div>
                <button className='bg-yellow text-black px-4 py-2 rounded-full hover:bg-light_yellow transition-all duration-200'>
                    Apply Now
                </button>
            </div>
        </div>
    )
}

export default Jobs
