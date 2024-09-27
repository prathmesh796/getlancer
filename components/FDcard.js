import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function FDcard() {
  return (
    <div>
        <div className='card border-2 p-5 rounded-md'>
                <div className='cardH pb-8'>
                  {/* <h1>{job.title}</h1> */}<h1 className='text-2xl text-bold'>Full Stack Developer</h1>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2 text-gray-400">Tech Co</p>
                  <p className="font-semibold mb-2">$50-70/hr</p>
                  <div className="flex flex-wrap gap-2">
                    {/* {job.skills.map((skill, index) => ( */}
                    <div className="
                    mb-4
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

                      
                    {/* // ))} */}
                  </div>
                  <button className="bg-black text-white border-2 border-black rounded-lg px-4 py-2">
                    <i className="fa-regular fa-envelope"></i>Apply Now
                  </button>
                </div>
              </div>
    </div>
  )
}
