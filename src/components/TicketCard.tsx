import React from "react";
import { Flag, CheckCircle, AlertCircle } from "lucide-react";

interface TicketCardProps {
  keyId: string;
  summary: string;
  priority: string;
  status: string;
}

const priorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "highest":
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-400";
  }
};

const statusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "done":
      return <CheckCircle className="text-green-500" size={20} />;
    case "in progress":
      return <AlertCircle className="text-yellow-500" size={20} />;
    default:
      return <Flag className="text-gray-400" size={20} />;
  }
};

const TicketCard: React.FC<TicketCardProps> = ({
  keyId,
  summary,
  priority,
  status,
}) => {
  return (
    <div className="flex flex-col justify-between bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{keyId}</h3>
        {statusIcon(status)}
      </div>
      <p className="text-gray-600 text-sm mb-3">{summary}</p>
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${priorityColor(priority)}`}>
          {priority} Priority
        </span>
        <span className="text-gray-500">{status}</span>
      </div>
    </div>
  );
};

export default TicketCard;
