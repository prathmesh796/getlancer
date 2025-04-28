import React from 'react'

const CJobs = () => {
    return (
        <div className='flex justify-between items-center border border-gray-300 rounded-xl shadow-md p-4 m-4 w-full'>
            <div className='p-4'>
                <h2 className='text-2xl font-semibold mb-4'>Job Title</h2>
                <p className='text-gray-600'>Job description goes here...</p>
            </div>

            <div className='flex items-center gap-4'>
                <p>Jobs Status</p>
            </div>
        </div>
    )
}

export default CJobs
