import React from 'react'

const CJobs = ({ jobid, job }) => {
    return (
        <div className='flex justify-between items-center border border-gray-300 rounded-xl shadow-md p-4 m-4 w-full' key={jobid}>
            <div className='p-4'>
                <h2 className='text-2xl font-semibold mb-4'>{job.title}</h2>
                <p className='text-gray-600'>{job.description}</p>
            </div>

            <div className='flex items-center gap-4'>
                <p>{job.status}</p>
            </div>
        </div>
    )
}

export default CJobs
