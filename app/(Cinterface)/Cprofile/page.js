"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';

const Cprofile = () => {
  const { data: session } = useSession();

  return (
    <main className="container mx-auto p-8">
      {/* Welcome Section */}
      <section className="text-center my-10">
        <h1 className="text-4xl font-bold mb-4">Welcome, {session?.user?.name || "Client"}!</h1>
        <p className="text-lg text-gray-600">Manage your projects and profile here.</p>
      </section>

      {/* Actions Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* View Profile */}
        <Link href="/Cprofile" className="block p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-2">View Profile</h2>
          <p className="text-gray-500">See and manage your profile details.</p>
        </Link>

        {/* Update Profile */}
        <Link href="/Cprofile/updateCprofile" className="block p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold mb-2">Update Profile</h2>
          <p className="text-gray-500">Edit your personal information and details.</p>
        </Link>

        {/* Post New Project (Future feature) */}
        <div className="block p-8 bg-gray-200 rounded-lg cursor-not-allowed">
          <h2 className="text-2xl font-semibold mb-2">Post New Project</h2>
          <p className="text-gray-500">Coming soon...</p>
        </div>

        {/* View Posted Projects (Future feature) */}
        <div className="block p-8 bg-gray-200 rounded-lg cursor-not-allowed">
          <h2 className="text-2xl font-semibold mb-2">View Your Projects</h2>
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </section>
    </main>
  );
};

export default Cprofile;