import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div>
        <div className="container mx-auto px-4 py-8">
      <div className="card max-w-3xl mx-auto  border-black border-2 p-10 rounded-lg">
        <div className='cardHead'>
          <div className="text-2xl md:text-3xl font-bold mb-3">Frontend Developer Skills Assessment</div>
          <div className='text-[14px] text-gray-400 mb-3'>Please review the test details before applying</div>
        </div>
        <div className='flex'><div className="
                    mb-4
                    mr-4
                     appearance-none 
                    bg-gray-200 
                    border-2 border-gray-200 
                    rounded-[15px] 
                    box-border 
                    text-black 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    w-[75px]
                    h-[25px]
                    text-[13px] 
                    pt-1 py-2 text-center
                    pb-6
                    "
                      >MongoDB</div>

<div className="
                    mb-4
                    mr-4
                     appearance-none 
                    bg-gray-200 
                    border-2 border-gray-200 
                    rounded-[15px] 
                    box-border 
                    text-black 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    w-[75px]
                    h-[25px]
                    text-[13px] 
                    pt-1 py-2 text-center
                    pb-6
                    "
                      >MongoDB</div>



<div className="
                    mb-4
                    mr-4
                     appearance-none 
                    bg-gray-200 
                    border-2 border-gray-200 
                    rounded-[15px] 
                    box-border 
                    text-black 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    w-[75px]
                    h-[25px]
                    text-[13px] 
                    pt-1 py-2 text-center
                    pb-6
                    "
                      >MongoDB</div>


<div className="
                    mb-4
                    mr-4
                     appearance-none 
                    bg-gray-200 
                    border-2 border-gray-200 
                    rounded-[15px] 
                    box-border 
                    text-black 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    w-[75px]
                    h-[25px]
                    text-[13px] 
                    pt-1 py-2 text-center
                    pb-6
                    "
                      >MongoDB</div>
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Test Overview</h2>
            <p className="text-muted-foreground">
              This assessment is designed to evaluate your skills in frontend development, focusing on React, JavaScript, and CSS. It will help us understand your coding abilities and problem-solving approach.
            </p>
          </section>

          <div className='mb-10 h-1 rounded-full opacity-15 bg-gray-400'></div> 

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Test Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 text-muted-foreground" />
                <span>Duration: 90 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 text-muted-foreground" />
                <span>Questions: 30 (mix of MCQ and coding)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 text-muted-foreground" />
                <span>Passing Score: 70%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 text-muted-foreground" />
                <span>Attempts Allowed: 2</span>
              </div>
            </div>
          </section>

          <div className='mb-10 h-1 rounded-full opacity-15 bg-gray-400'></div>

          <section>
            <h2 className="text-xl font-semibold mb-2">Why Take This Test?</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Showcase your frontend development skills to potential employers</li>
              <li>Receive a detailed report of your strengths and areas for improvement</li>
              <li>Gain a competitive edge in the job market with a verified skills badge</li>
              <li>Identify gaps in your knowledge and focus your learning efforts</li>
            </ul>
          </section>

          <div className='mb-10 h-1 rounded-full opacity-15 bg-gray-400'/>

          <section>
            <h2 className="text-xl font-semibold mb-2">Before You Begin</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Ensure you have a stable internet connection</li>
              <li>Find a quiet place where you can focus for the duration of the test</li>
              <li>Have a modern web browser (Chrome, Firefox, or Safari recommended)</li>
              <li>Prepare any allowed reference materials (if applicable)</li>
            </ul>
          </section>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">By applying, you agree to our terms and conditions.</p>
          <button className="bg-black text-white border-2 border-black rounded-lg px-4 py-2"><Link href='/contest'>
        Apply For Test..</Link>
    </button>
        </div>
      </div>
    </div>
    </div>
  )
}
