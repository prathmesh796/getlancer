"use client";
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import Jobs from '@/components/Jobs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

export default function Page() {
  const { data: session, status } = useSession();

  const [showDiv, setShowDiv] = React.useState(false);
  const [jobRecommendations, setJobRecommendations] = React.useState([]);
  const [allJobs, setAllJobs] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [session?.status, router]);

  useEffect(() => {
    const fetchJobRecommendations = async () => {
      try {
        const response = await fetch('/api/jobs/recommendations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobRecommendations(data);
      } catch (error) {
        console.error("Error fetching job recommendations:", error);
      }
    };

    fetchJobRecommendations();
  }, []);

  // Fetch all jobs with filtering
  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('limit', '50');
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }

        const response = await fetch(`/api/jobs?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAllJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching all jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [statusFilter]);

  const handleClick = () => {
    setShowDiv(!showDiv);
  };

  // Filter jobs based on search query
  const filteredJobs = allJobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.skills?.some(skill => skill.toLowerCase().includes(query))
    );
  });

  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        <main className="flex-1 overflow-y-auto min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent">Let&apos;s find some work...</h1>
              <div className='m-4 p-2 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 flex justify-center gap-2 items-center shadow-md w-2/3 '>
                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '30px', height: '30px' }} className='mr-6 text-gray-400 dark:text-slate-400' />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-gray-50 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-50 z-10 focus:outline-none"
                  placeholder="Search jobs by title, location, or skills..."
                />

                <select
                  name="JobStatus"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='px-4 py-2 rounded-full border border-gray-300 dark:border-slate-600 focus:outline-none bg-white dark:bg-slate-700 dark:text-slate-50 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors'
                >
                  <option value="all">All Jobs</option>
                  <option value="open">Open</option>
                  <option value="assigned">Assigned</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Recommended Jobs Section */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow to-light_yellow rounded-full"></div>
                <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">Recommended for You</h2>
              </div>
              <div className="space-y-4">
                {jobRecommendations.length > 0 ? (
                  jobRecommendations.map((job) => (
                    <Jobs key={job._id} job={job} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No recommendations available</p>
                )}
              </div>
            </section>

            {/* All Jobs Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">
                  All Available Jobs
                  <span className="text-lg font-normal text-gray-600 ml-3">
                    ({filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'})
                  </span>
                </h2>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-pulse text-gray-600 text-lg">Loading jobs...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <Jobs key={job._id} job={job} />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                      <p className="text-gray-500 dark:text-slate-400 text-lg">
                        {searchQuery
                          ? `No jobs found matching "${searchQuery}"`
                          : "No jobs available at the moment"
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    )
  }
  else { return null }
}
