"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Job } from "@/types/Jobs";

export default function Page({ params }) {
  const job_id: string = use(params);

  const [proposal, setProposal] = useState("");
  const [jobDetails, setJobDetails] = useState<Job | null>(null);

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
          throw new Error(`Failed to fetch job details: ${response.status}`);
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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <header className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Apply for Job</h1>
          <p className="text-gray-500 mt-1">Job ID: {job_id}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Title</p>
            <p className="text-lg font-semibold text-gray-900">{jobDetails?.title || "Loading..."}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</p>
            <p className="text-lg text-gray-700">{jobDetails?.company}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</p>
            <p className="text-gray-700">{jobDetails?.location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Salary</p>
            <p className="text-gray-700 font-medium">{jobDetails?.bounty}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</p>
            <p className="text-gray-600 leading-relaxed">{jobDetails?.description}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Skills</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {jobDetails?.skills?.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Posted on</p>
            <p className="text-gray-500 text-sm">
              {jobDetails?.datePosted ? new Date(jobDetails.datePosted).toLocaleDateString() : ""}
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-gray-100">
          <div>
            <label htmlFor="proposal" className="block text-sm font-bold text-gray-700 mb-2">
              Your Proposal
            </label>
            <textarea
              id="proposal"
              placeholder="Explain why you are the best fit for this role..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow focus:border-transparent outline-none transition-all duration-200 bg-gray-50"
              rows={6}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-yellow text-black font-bold px-10 py-3 rounded-full hover:bg-light_yellow shadow-md hover:shadow-lg transition-all duration-200"
            >
              Submit Application
            </button>
            <button
              type="button"
              onClick={toPreviousPage}
              className="w-full sm:w-auto px-10 py-3 rounded-full border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Back to Jobs
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}