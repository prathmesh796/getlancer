"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useMemo } from "react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function MyCalendar() {
  const events = useMemo(
    () => [],
    []
  );

  const handleAddToGoogleCalendar = (event) => {
    const formatDate = (date) =>
      date.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, -1);

    const start = formatDate(event.start);
    const end = formatDate(event.end);

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;

    window.open(url, "_blank");
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "20px" }}
        selectable
        onSelectEvent={handleAddToGoogleCalendar}
      />
      <p className="text-sm text-gray-500 mt-2">
        Click any event to add it to your Google Calendar.
      </p>
    </div>
  );
}