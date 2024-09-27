
import React from 'react'
import FImage from '../../../components/FImage'



export default function page() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Header */}
          <div className="md:col-span-3">
            <div className="justify-around flex flex-col md:flex-row items-center gap-6 bg-muted bg-gray-200 p-6 rounded-lg">
              <img
                src="https://tse4.mm.bing.net/th?id=OIP.hGSCbXlcOjL_9mmzerqAbQHaHa&pid=Api&P=0&h=180"
                alt="img"
                width={128}
                height={128}
                className="rounded-full bg-cover border-gray-200"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">Jane Doe</h1>
                <p className="text-xl text-muted-foreground text-gray-500">Full Stack Developer</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <div class="
                    w-[90px]
                    h-[30px]
                    appearance-none 
                    bg-black 
                    border-2 border-gray-800 
                    rounded-[15px] 
                    box-border 
                    text-white 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    text-[16px] 
                    text-center
                    ">React</div>

                  <div class="
                    w-[90px]
                    h-[30px]
                    appearance-none 
                    bg-black 
                    border-2 border-gray-800 
                    rounded-[15px] 
                    box-border 
                    text-white 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    text-[16px] 
                    text-center
                    ">Node.js</div>

                  <div class="
                    
                    appearance-none 
                    bg-black 
                    border-2 border-gray-800 
                    rounded-[15px] 
                    box-border 
                    text-white 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    w-[90px]
                    h-[30px]
                    text-[16px] 
                    text-center
                    ">UI/UX</div>

                  <div class="
                    w-[90px]
                    h-[30px]
                    appearance-none 
                    bg-black 
                    border-2 border-gray-800 
                    rounded-[15px] 
                    box-border 
                    text-white 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    text-[16px] 
                    text-center
                    ">Python</div>
                </div>
              </div>
              <div class="right-10">
                <button class="bg-black text-white border-2 border-gray-200 rounded-lg px-4 py-2 ">
                  <i class="fa-regular fa-envelope"></i>Contact Me
                </button>
              </div>

            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div class="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
              <h2 className="text-2xl font-semibold mb-4 ">About Me</h2>
              <p className="text-muted-foreground">
                I'm a passionate full stack developer with over 5 years of experience in creating
                robust web applications. I specialize in React, Node.js, and Python, and I'm always
                eager to take on new challenges and learn new technologies.
              </p>
            </div>
            {/* Portfolio Section */}
            <div>
              <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
                <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="relative aspect-video">
                      <FImage />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
                <h2 className="text-2xl font-semibold mb-4">Client Reviews</h2>
                <div className="space-y-4">
                  {[
                    { name: "John Smith", review: "Excellent work! Delivered on time and exceeded expectations." },
                    { name: "Sarah Johnson", review: "Great communication and problem-solving skills. Highly recommended!" },
                  ].map((review, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.name}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i class="fa-solid fa-star"></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div>
              <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {["JavaScript", "React", "Node.js", "Python", "Django", "PostgreSQL", "MongoDB", "Docker", "AWS", "Git"].map((skill) => (
                    <div class=" appearance-none 
                    bg-gray-200 
                    border-2 border-gray-200 
                    rounded-[15px] 
                    box-border 
                    text-black 
                    cursor-pointer 
                    inline-block 
                    font-sans 
                    font-semibold 
                    w-[90px]
                    h-[30px]
                    text-[12px] 
                    pt-1 py-2 text-center
                    "
                     key={skill} variant="secondary">{skill}
                     </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="m-3 p-4 border-2 border-gray-200 rounded-[10px]">
                <h2 className="text-2xl font-semibold mb-4">Education</h2>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold">BSc in Computer Science</h3>
                    <p className="text-sm text-muted-foreground">University of Technology, 2015-2019</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Full Stack Web Development</h3>
                    <p className="text-sm text-muted-foreground">Tech Bootcamp, 2020</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </div>
  )
}
