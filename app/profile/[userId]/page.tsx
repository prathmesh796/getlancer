"use client"

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Cprofile from '@/components/Cprofile';
import Fprofile from '@/components/Fprofile';
import { Spinner } from '@/components/ui/spinner';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useSession } from 'next-auth/react';

export default function ViewProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const router = useRouter();
    const { data: session, status } = useSession();
    const role = session?.user?.role;
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null)
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId && status !== "loading") {
            setLoading(true);
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, status, role]);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            let apiUrl = '';
            console.log("Current user role:", role);

            if (role === "Client") {
                apiUrl = `/api/profile/FreelancerProfile/?userId=${encodeURIComponent(userId)}`;
            } else {
                apiUrl = `/api/profile/ClientProfile/?userId=${encodeURIComponent(userId)}`;
            }

            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfile(data.profile || {});
            setUser(data.user)

            // Fetch user name
            const userResponse = await fetch(`/api/profile/user?userId=${encodeURIComponent(userId)}`);
            if (userResponse.ok) {
                const userData = await userResponse.json();
                setUserName(userData.name || "Client");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
                <Spinner className="size-10" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-red-600 text-xl mb-4">Error loading profile: {error}</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-linear-to-r from-yellow to-light_yellow text-deep_blue rounded-full font-semibold hover:shadow-lg transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar userId={session?.user?.id} />
            {/* Main Content */}
            <main className="flex-1 min-h-screen">
                <Navbar activeTab={"profile"} />
                {role == "Client" ? (
                    <Fprofile freelancerProfile={profile} user={user} />
                ) : (
                    <Cprofile clientProfile={profile} user={user} />
                )}
            </main>
        </div>
    )
}