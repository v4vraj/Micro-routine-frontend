import { useState } from "react";
import { Smile, Frown, Meh, Laugh, Angry } from "lucide-react";

const moodLevels = [
  { level: 1, icon: <Angry size={30} />, label: "Very Stressed" },
  { level: 2, icon: <Frown size={30} />, label: "Stressed" },
  { level: 3, icon: <Meh size={30} />, label: "Neutral" },
  { level: 4, icon: <Smile size={30} />, label: "Good" },
  { level: 5, icon: <Laugh size={30} />, label: "Great" },
];

const CheckinModal = ({ onClose, onSubmit }: any) => {
  const [mood, setMood] = useState(3);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-gray-800">
          How are you feeling today?
        </h2>

        <div className="flex justify-between px-2 my-4">
          {moodLevels.map((m) => (
            <div
              key={m.level}
              className={`p-2 rounded-full cursor-pointer transition ${
                mood === m.level ? "bg-indigo-100 scale-110" : ""
              }`}
              onClick={() => setMood(m.level)}
            >
              {m.icon}
            </div>
          ))}
        </div>

        <button
          onClick={() => onSubmit(mood)}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700"
        >
          Check In
        </button>

        <button onClick={onClose} className="w-full mt-2 text-gray-600 text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckinModal;
