import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  calendar: string;
}

interface CalendarViewProps {
  events: EventItem[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl mx-auto">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventColor="#4f46e5" // Tailwind indigo
        height="80vh"
      />
    </div>
  );
};

export default CalendarView;
