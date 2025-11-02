import React from "react";
import CalendarView from "../CalendarView";
import type { EventItem } from "../../utils/types";

interface CalendarSectionProps {
  events: EventItem[];
}

const CalendarSection: React.FC<CalendarSectionProps> = ({ events }) => (
  <section>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-700">Your Calendar</h2>
      <div className="h-[2px] bg-gray-300 flex-1 ml-4"></div>
    </div>

    <div className="bg-white rounded-2xl shadow-md p-6">
      {events.length > 0 ? (
        <CalendarView events={events} />
      ) : (
        <p className="text-center text-gray-500">No upcoming events found.</p>
      )}
    </div>
  </section>
);

export default CalendarSection;
