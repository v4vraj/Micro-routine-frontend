import React from "react";
import FitnessIcon from "./FitnessIcon";
import CircularProgress from "./CircularProgress";
import type { IconType } from "../utils/types";

/**
 * Renders a data card for a specific fitness metric.
 */
interface FitnessCardProps {
  title: string;
  value: number;
  goal: number;
  unit: string;
  iconType: IconType;
  colorClass: string;
}

const FitnessCard: React.FC<FitnessCardProps> = ({
  title,
  value,
  goal,
  unit,
  iconType,
  colorClass,
}) => {
  const progress = goal > 0 ? (value / goal) * 100 : 0;
  const formattedValue = Math.round(value);
  const formattedGoal = Math.round(goal);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between">
      {/* Header */}
      <div className="flex items-center justify-center w-full mb-4">
        <FitnessIcon type={iconType} />
        <h3 className="text-xl font-semibold text-gray-700 ml-2">{title}</h3>
      </div>

      {/* Body (Progress Circle) */}
      <div className="relative flex items-center justify-center my-4">
        <CircularProgress percentage={progress} color={colorClass} />
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800">
            {formattedValue}
          </span>
          <span className="text-sm text-gray-500">
            / {formattedGoal} {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FitnessCard;
