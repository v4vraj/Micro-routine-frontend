import React, { useEffect, useState } from "react";
import {
  fetchSteps,
  fetchCalories,
  fetchActiveMinutes,
  fetchCalendarEvents,
  fetchJiraTickets,
} from "../api/dashboardAPI";

import {
  fetchTodayAttendance,
  sendCheckin,
  sendCheckout,
} from "../api/attendanceAPI";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import JiraSection from "../components/dashboard/JiraSection";
import FitnessSection from "../components/dashboard/FitnessSection";
import CalendarSection from "../components/dashboard/CalendarSection";
import GoalModals from "../components/dashboard/GoalModals";
import WellnessScoreCard from "../components/dashboard/WellnessScoreCard";
import RecommendationCard from "../components/dashboard/RecommendationCard";
import CheckinModal from "../components/dashboard/CheckinModal";
import CheckinCard from "../components/dashboard/CheckinCard";

import type {
  StepsData,
  CaloriesData,
  MinutesData,
  EventItem,
  Attendance,
} from "../utils/types";

import { useAuth } from "../hooks/useAuth";

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

  const { user } = useAuth();
  if (!user) return <div>Loading...</div>; // guard

  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const userId = user.id;
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

    const loadAttendance = async () => {
      const data = await fetchTodayAttendance();
      setAttendance(data);

      // show modal ONLY if user has not checked in today
      if (!data?.checkin_time) setShowModal(true);
      else setShowModal(false);
    };

    loadAllData();
    loadAttendance();
  }, []);

  // HANDLE CHECKIN
  const handleCheckin = async (mood: number) => {
    const res = await sendCheckin(mood);
    setAttendance(res.log);
    setShowModal(false);
  };

  // HANDLE CHECKOUT
  const handleCheckout = async () => {
    const res = await sendCheckout(user.employee_id);
    setAttendance(res.log);
  };

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
      <RecommendationCard userId={user.id} />
      <WellnessScoreCard userId={user.id} />

      {/* ⭐ CHECKIN CARD */}
      <CheckinCard attendance={attendance} onCheckout={handleCheckout} />

      {/* ⭐ MANUAL CHECK-IN BUTTON (only show if not checked in) */}
      {!attendance?.checkin_time && (
        <div className="my-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow hover:bg-indigo-700"
          >
            Check In Now
          </button>
        </div>
      )}

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

      {/* ⭐ CHECK-IN MODAL */}
      {showModal && (
        <CheckinModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCheckin}
        />
      )}
    </div>
  );
};

export default Dashboard;
