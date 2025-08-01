"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from '@/components/Sidebar';

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
            <Sidebar />

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