import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function FDcard() {
  const jobs = [
    { title: "Full Stack Developer", company: "Tech Co", rate: "$50-70/hr", skills: ["MongoDB", "React", "Node.js"] },
    { title: "Data Scientist", company: "AI Labs", rate: "$60-80/hr", skills: ["Python", "TensorFlow", "SQL"] },
    { title: "UI/UX Designer", company: "Design Studio", rate: "$40-60/hr", skills: ["Figma", "Sketch", "Adobe XD"] },
    { title: "Mobile App Developer", company: "App Creators", rate: "$55-75/hr", skills: ["Flutter", "Swift", "Kotlin"] },
    { title: "Cybersecurity Analyst", company: "SecureNet", rate: "$70-90/hr", skills: ["PenTesting", "Firewalls", "Encryption"] },
    { title: "Cloud Engineer", company: "CloudPro", rate: "$65-85/hr", skills: ["AWS", "Azure", "Docker"] },
    { title: "DevOps Engineer", company: "DevOps Hub", rate: "$75-95/hr", skills: ["Kubernetes", "CI/CD", "Terraform"] },
    { title: "Frontend Developer", company: "Web Works", rate: "$45-65/hr", skills: ["React", "Vue.js", "CSS"] },
    { title: "Backend Developer", company: "API Masters", rate: "$50-70/hr", skills: ["Node.js", "Django", "GraphQL"] },
    { title: "Machine Learning Engineer", company: "ML Innovate", rate: "$80-100/hr", skills: ["Scikit-learn", "PyTorch", "Data Science"] },
    { title: "Blockchain Developer", company: "CryptoTech", rate: "$90-110/hr", skills: ["Solidity", "Ethereum", "Smart Contracts"] },
    { title: "Game Developer", company: "GameX", rate: "$55-75/hr", skills: ["Unity", "C#", "Unreal Engine"] },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {jobs.map((job, index) => (
        <div key={index} className='card border-2 p-5 rounded-md'>
          <div className='cardH pb-8'>
            <h1 className='text-2xl font-bold'>{job.title}</h1>
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-gray-400">{job.company}</p>
            <p className="font-semibold mb-2">{job.rate}</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <div key={i} className="mb-4 appearance-none bg-gray-200 border-2 border-gray-200 rounded-[15px] box-border text-black cursor-pointer inline-block font-sans font-semibold w-[100px] h-[30px] text-[13px] pt-1 py-2 text-center pb-6">
                  {skill}
                </div>
              ))}
            </div>
            <button className="bg-black text-white border-2 border-black rounded-lg px-4 py-2">
              Apply Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
