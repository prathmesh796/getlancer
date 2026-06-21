"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Months list
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Define min / max year boundaries (optional)
const MIN_YEAR = 1970;
const MAX_YEAR = 2050;

export default function MonthYearDatePicker({ dateType }: { dateType: "startDate" | "endDate" }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(date?.getMonth() ?? new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(date?.getFullYear() ?? new Date().getFullYear());

  // Update calendar when user changes month/year dropdown
  const updateDisplayedDate = (month: number, year: number) => {
    try {
      const newDate = new Date(year, month, 1);

      // Basic validation
      if (isNaN(newDate.getTime())) return;

      setCurrentMonth(month);
      setCurrentYear(year);
      setDate(prev => {
        if (!prev) return newDate;
        return new Date(year, month, prev.getDate());
      });
    } catch {
      console.error("Invalid month/year selection");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-65 justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-3">

        {/* Month + Year Selectors */}
        <div className="flex gap-2 mb-3">

          {/* Month Dropdown */}
          <select
            className="border rounded p-1"
            value={currentMonth}
            onChange={(e) => updateDisplayedDate(Number(e.target.value), currentYear)}
          >
            {monthNames.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            className="border rounded p-1"
            value={currentYear}
            onChange={(e) => {
              const year = Number(e.target.value);
              if (year >= MIN_YEAR && year <= MAX_YEAR) {
                updateDisplayedDate(currentMonth, year);
              }
            }}
          >
            {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }).map((_, idx) => {
              const y = MIN_YEAR + idx;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>

        </div>

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              setDate(d);
              setCurrentMonth(d.getMonth());
              setCurrentYear(d.getFullYear());
            }
          }}
          month={new Date(currentYear, currentMonth, 1)}
          onMonthChange={(month) => {
            setCurrentMonth(month.getMonth());
            setCurrentYear(month.getFullYear());
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
