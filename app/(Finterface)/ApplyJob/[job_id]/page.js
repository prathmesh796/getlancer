"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page({ params }) {
  const { job_id } = use(params);

  const [proposal, setProposal] = useState("");
  const [jobDetails, setJobDetails] = useState(null);

  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();

  const toPreviousPage = () => {
    router.push("/Fdash");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/jobs/${job_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, proposal }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      alert("Application submitted successfully!");
      router.push("/Fdash");
    } catch (error) {
      console.error("Error submitting job application:", error);
    }
  }

  useEffect(() => {
    // Fetch job details using job_id
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobs/${job_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`${response.error}: ${response.status}`);
        }
        const data = await response.json();
        setJobDetails(data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    fetchJobDetails();
  }, [job_id]);

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Apply for Job</h1>
        <p className="text-lg mb-2">Job ID: {job_id}</p>
        <p className="text-lg mb-2">Job Title: {jobDetails?.title}</p>
        <p className="text-lg mb-2">Company: {jobDetails?.company}</p>
        <p className="text-lg mb-2">Location: {jobDetails?.location}</p>
        <p className="text-lg mb-2">Salary: {jobDetails?.salary}</p>
        <p className="text-lg mb-2">Description: {jobDetails?.description}</p>
        <p className="text-lg mb-2">Skills: {jobDetails?.skills.join(", ")}</p>
        <p className="text-lg mb-2">Posted on: {new Date(jobDetails?.createdAt).toLocaleDateString()}</p>

        {/* Add your job application form here */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          {/* Form fields go here */}
          <div className="mb-4">
            <label htmlFor="proposal" className="block text-gray-700">Proposal</label>
            <textarea placeholder="Write your proposal here..."
              id="proposal"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              rows={4}
            />
          </div>

          <button type="submit" className="flex bg-yellow m-10 text-black px-6 py-2 rounded-full hover:bg-light_yellow transition-all duration-200">Submit Application</button>
        </form>
      </div>
      <div className="flex justify-center items-center mt-4">
        <button onClick={toPreviousPage} className="bg-yellow text-black px-4 py-2 rounded-full hover:bg-light_yellow transition-all duration-200">
          Back to Jobs
        </button>
      </div>
    </main>
  )
}