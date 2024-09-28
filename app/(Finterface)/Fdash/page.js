"use client"
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import FDcard from '@/components/FDcard';
import  { useState } from "react";


export default function page() {
    const [showDiv, setShowDiv] = useState(false);

    const handleClick = () => {
      setShowDiv(!showDiv); // Toggle the state
    };
  return (
    <div>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>
            <div className="flex items-center space-x-4">


              <div className='text-black'>
                <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', width: '20px' }} className='mr-6' />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">

            <div className='p-3 rounded-md border border-gray-300  flex justify-start gap-2 items-center shadow-md w-[70vw] '>
              <FontAwesomeIcon icon={faSearch} style={{ fontSize: '20px', width: '20px' }} className='mr-6' />
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

              {/* ))} */}
            </div>
          </section>
          <div className='m-10 h-1 rounded-full opacity-15 bg-gray-400' />
          
            <div>
              <div className='border-b mb-5 pb-3'>
                <h1 className="text-2xl font-bold">Search here your Domain To Get Resorces</h1>

              </div>
              <div className='flex'>

              <div className='m-3 p-3 rounded-md border border-gray-300  flex justify-start gap-2 items-center shadow-md w-[20vw] '>
                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '20px', width: '20px' }} className='mr-6' />
                <input
                  type="text"
                  // onChange={(e) => setQuery(e.target.value)}
                  className="w-[20vw] border-gray-50 z-10  focus:outline-none" placeholder="Search for Resources..."
                />
              </div>
              <button onClick={handleClick} className="bg-black text-white border-2 border-black rounded-lg px-5  mt-3 ">{showDiv ? "Hide" : "Show"}</button>
            </div>

            <div className="">
              {showDiv && (
                <div className="mt-4 p-4 border-gray-200 border-2 rounded-lg flex">
                  <div className='mr-3'>
                  <iframe className='mb-3' width="450" height="250" src="https://www.youtube.com/embed/O3BUHwfHf84?si=Y4bzMtcKNj69UnmZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  <div>Discription</div>
                  </div>

                  <div className='mr-3'>
                  <iframe className='mb-3' width="450" height="250" src="https://www.youtube.com/embed/O3BUHwfHf84?si=Y4bzMtcKNj69UnmZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  <div>Discription</div>
                  </div>

                  <div className='mr-3'>
                  <iframe className='mb-3' width="450" height="250" src="https://www.youtube.com/embed/O3BUHwfHf84?si=Y4bzMtcKNj69UnmZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  <div>Discription</div>
                  </div>
                  
                </div>
                
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}