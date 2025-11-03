import React, { useEffect, useState } from "react";
import {
  fetchSteps,
  fetchCalories,
  fetchActiveMinutes,
  fetchCalendarEvents,
  fetchJiraTickets,
} from "../api/dashboardAPI";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import JiraSection from "../components/dashboard/JiraSection";
import FitnessSection from "../components/dashboard/FitnessSection";
import CalendarSection from "../components/dashboard/CalendarSection";
import GoalModals from "../components/dashboard/GoalModals";
import WellnessScoreCard from "../components/dashboard/WellnessScoreCard";

import type {
  StepsData,
  CaloriesData,
  MinutesData,
  EventItem,
} from "../utils/types";

const Dashboard: React.FC = () => {
  const [stepsData, setStepsData] = useState<StepsData | null>(null);
  const [caloriesData, setCaloriesData] = useState<CaloriesData | null>(null);
  const [minutesData, setMinutesData] = useState<MinutesData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    "steps" | "calories" | "minutes" | null
  >(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const userId = localStorage.getItem("user_id")!;
        const [steps, calories, minutes, events, jiraTickets] =
          await Promise.all([
            fetchSteps(),
            fetchCalories(),
            fetchActiveMinutes(),
            fetchCalendarEvents(),
            fetchJiraTickets(userId),
          ]);
        setStepsData(steps);
        setCaloriesData(calories);
        setMinutesData(minutes);
        setEvents(events);
        setTickets(jiraTickets);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const handleGoalUpdate = (
    type: "steps" | "calories" | "minutes",
    newGoal: number
  ) => {
    if (type === "steps" && stepsData)
      setStepsData({ ...stepsData, step_goal: newGoal });
    if (type === "calories" && caloriesData)
      setCaloriesData({ ...caloriesData, calorie_goal: newGoal });
    if (type === "minutes" && minutesData)
      setMinutesData({ ...minutesData, active_minute_goal: newGoal });
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 text-lg">
        Loading dashboard...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 md:p-8">
      <DashboardHeader />
      <WellnessScoreCard userId={localStorage.getItem("user_id")!} />
      <JiraSection tickets={tickets} />
      <FitnessSection
        stepsData={stepsData}
        caloriesData={caloriesData}
        minutesData={minutesData}
        onSetGoal={setActiveModal}
      />
      <CalendarSection events={events} />
      <GoalModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSuccess={handleGoalUpdate}
      />
    </div>
  );
};

export default Dashboard;
