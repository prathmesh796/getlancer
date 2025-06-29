"use client";
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import Jobs from '@/components/Jobs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { cat } from 'fontawesome';

export default function page() {
  const { data: session, status } = useSession();

  const [showDiv, setShowDiv] = React.useState(false);
  const [jobRecommendations, setJobRecommendations] = React.useState([]);

  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login page
    if (session?.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [session?.status]);

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

  const handleClick = () => {
    setShowDiv(!showDiv);
  };

  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 hidden md:block">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          <nav className="space-y-2">

            <Link
              href="#"
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
            >
              {/* <Layout className="h-5 w-5" /> */}
              <span>Dashboard</span>
            </Link>
            <Link href="/messages" className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg">
              {/* <MessageSquare className="h-5 w-5" /> */}
              <span>Messages</span>
            </Link>
            <Link href="/schedule" className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg">
              {/* <Calendar className="h-5 w-5" /> */}
              <span>Schedule</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto min-h-screen">
          <header className="border-b">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Let's find some work...</h1>
              <div className='m-4 p-2 rounded-full border border-gray-300  flex justify-center gap-2 items-center shadow-md w-2/3 '>
                <FontAwesomeIcon icon={faSearch} style={{ fontSize: '1px', width: '30px', height: '30px' }} className='mr-6' />
                <input
                  type="text"
                  //onChange={(e) => setQuery(e.target.value)}
                  className="w-full border-gray-50 z-10  focus:outline-none" placeholder="Search your jobs..."
                />

                <select name="JobStatus" id="" className='px-4 py-2 rounded-full border border-gray-300 focus:outline-none'>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 py-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Recently Posted Jobs</h2>
              <div className="">
                {jobRecommendations.map((job) => (
                  <Jobs key={job._id} job={job} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    )
  }
  else { return null }
}
