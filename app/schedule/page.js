"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const CalendarEvents = () => {
    const { data: session } = useSession();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!session?.accessToken) return;

            const res = await fetch(
                "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&singleEvents=true&orderBy=startTime",
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            const data = await res.json();
            setEvents(data.items || []);
        };

        fetchEvents();
    }, [session]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>
                <nav className="space-y-2">

                    <Link
                        href="/"
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

            <main className="flex-1 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Your Google Calendar Events</h1>

                {events.map((event) => (
                    <div key={event.id} className="mb-2">
                        <p className="font-semibold">{event.summary || "No title"}</p>
                        <p className="text-sm text-gray-500">
                            {event.start?.dateTime || event.start?.date} -{" "}
                            {event.end?.dateTime || event.end?.date}
                        </p>
                    </div>
                ))}
            </main>


        </div>
    );
};

export default CalendarEvents;