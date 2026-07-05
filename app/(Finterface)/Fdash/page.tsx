"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Jobs from '@/components/Jobs';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Job } from '@/types/Jobs';
import { Spinner } from '@/components/ui/spinner';
import Navbar from '@/components/Navbar';
import MyPagination from '@/components/Pagination';

export default function Page() {
  const { data: session } = useSession();

  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    const fetchJobRecommendations = async () => {
      setLoading(true);
      try {
        const params = { limit: 50, skip: 0 }
        const response = await fetch(`/api/jobs/recommendations?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setJobRecommendations(data);
      } catch (error) {
        console.error("Error fetching job recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobRecommendations();
  }, []);

  // Fetch all jobs with filtering
  useEffect(() => {
    const fetchSearchJobs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('limit', '50');

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

    fetchSearchJobs();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar userId={session?.user?.id} />

      <main className="flex-1 min-w-0 overflow-y-auto min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar activeTab={"Dashboard"} />
        <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-deep_blue to-marine_blue dark:from-yellow dark:to-light_yellow bg-clip-text text-transparent text-center md:text-left">Let&apos;s find some work...</h1>
            <div className='m-0 md:m-4 p-2 rounded-2xl md:rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 flex flex-col md:flex-row justify-center gap-2 items-center shadow-md w-full md:w-2/3'>
              <div className="flex items-center w-full px-2">
                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '20px', height: '20px' }} className='mr-4 text-gray-400 dark:text-slate-400 shrink-0' />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="z-10 h-9 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm md:text-base w-full"
                  placeholder="Search jobs by title, location, or skills..."
                />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Recommended Jobs Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-linear-to-b from-yellow to-light_yellow rounded-full"></div>
              <h2 className="text-3xl font-bold text-deep_blue dark:text-slate-50">Recommended for You</h2>
            </div>
            <div className="space-y-4">
              {jobRecommendations.length > 0 ? (
                <div>
                  {jobRecommendations.slice((currentPage - 1) * 4, (currentPage * 4)).map((job) => (
                    <Jobs key={job?.job?._id} job={job?.job} />
                  ))}

                  <MyPagination totalItems={jobRecommendations.length} limit={4} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No recommendations available
                </p>
              )}
            </div>
          </section>
        </div>
      </main >
    </div >
  )
}
