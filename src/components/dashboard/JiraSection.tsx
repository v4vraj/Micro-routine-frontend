import React from "react";
import TicketCard from "../TicketCard";

interface JiraSectionProps {
  tickets: any[];
}

const JiraSection: React.FC<JiraSectionProps> = ({ tickets }) => (
  <section className="mt-16">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-700">
        Your Jira Tickets
      </h2>
      <div className="h-[2px] bg-gray-300 flex-1 ml-4"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.length > 0 ? (
        tickets.map((t) => (
          <TicketCard
            key={t.key}
            keyId={t.key}
            summary={t.summary}
            priority={t.priority}
            status={t.status}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No high-priority tickets found.
        </p>
      )}
    </div>
  </section>
);

export default JiraSection;
