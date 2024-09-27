import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import FDcard from '@/components/FDcard';

export default function page() {
  return (
    <div>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
            <div className="flex items-center space-x-4">


              <div className='text-black'>
                <FontAwesomeIcon icon={faUser} style={{ fontSize: '1px', width: '20px' }} className='mr-6' />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">

            <div className='p-3 rounded-md border border-gray-300  flex justify-start gap-2 items-center shadow-md w-[70vw] '>
              <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '20px' }} className='mr-6' />
              <input
                type="text"
                // onChange={(e) => setQuery(e.target.value)}
                className="w-[70vw] border-gray-50 z-10  focus:outline-none" placeholder="Search for jobs..."
              />
            </div>
          </div>


          <section>
            <h2 className="text-4xl font-semibold mb-4">Job Recommendations</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* {jobRecommendations.map((job) => ( */}
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              <FDcard />
              {/* ))} */}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
