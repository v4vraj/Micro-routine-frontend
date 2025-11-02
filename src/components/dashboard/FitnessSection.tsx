import React from "react";
import FitnessCard from "../FitnessCard";
import type { StepsData, CaloriesData, MinutesData } from "../../utils/types";

interface FitnessSectionProps {
  stepsData: StepsData | null;
  caloriesData: CaloriesData | null;
  minutesData: MinutesData | null;
  onSetGoal: (type: "steps" | "calories" | "minutes") => void;
}

const FitnessSection: React.FC<FitnessSectionProps> = ({
  stepsData,
  caloriesData,
  minutesData,
  onSetGoal,
}) => (
  <section className="mb-16">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-700">Today's Activity</h2>
      <div className="h-[2px] bg-gray-300 flex-1 ml-4"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stepsData && (
        <FitnessCard
          title="Steps"
          value={stepsData.steps_completed}
          goal={stepsData.step_goal}
          unit="steps"
          iconType="steps"
          colorClass="text-blue-500"
          onSetGoal={() => onSetGoal("steps")}
        />
      )}
      {caloriesData && (
        <FitnessCard
          title="Calories"
          value={caloriesData.calories_burned}
          goal={caloriesData.calorie_goal}
          unit="kcal"
          iconType="calories"
          colorClass="text-orange-500"
          onSetGoal={() => onSetGoal("calories")}
        />
      )}
      {minutesData && (
        <FitnessCard
          title="Active Minutes"
          value={minutesData.active_minutes}
          goal={minutesData.active_minute_goal}
          unit="mins"
          iconType="minutes"
          colorClass="text-green-500"
          onSetGoal={() => onSetGoal("minutes")}
        />
      )}
    </div>
  </section>
);

export default FitnessSection;
