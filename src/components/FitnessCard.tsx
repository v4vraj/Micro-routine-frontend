// src/components/FitnessCard.tsx
import React from "react";
import FitnessIcon from "./FitnessIcon";
import CircularProgress from "./CircularProgress";

interface FitnessCardProps {
  title: string;
  value: number;
  goal: number;
  unit: string;
  iconType: "steps" | "calories" | "minutes";
  colorClass: string;
  onSetGoal: () => void; // ✅ new prop
}

const FitnessCard: React.FC<FitnessCardProps> = ({
  title,
  value,
  goal,
  unit,
  iconType,
  colorClass,
  onSetGoal,
}) => {
  const percentage = goal > 0 ? (value / goal) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <FitnessIcon type={iconType} />
          <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
        </div>
        <button
          onClick={onSetGoal}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ⚙️ Set Goal
        </button>
      </div>

      <CircularProgress percentage={percentage} color={colorClass} />
      <p className="text-lg font-semibold mt-4">
        {value} / {goal} {unit}
      </p>
    </div>
  );
};

export default FitnessCard;
