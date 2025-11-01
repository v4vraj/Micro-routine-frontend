import React, { useEffect, useState } from "react";
import axios from "axios";

// Components
import CalendarView from "../components/CalendarView";
import FitnessCard from "../components/FitnessCard";
import GoalModal from "../components/GoalModal";

// Types
import type {
  EventItem,
  StepsData,
  CaloriesData,
  MinutesData,
} from "../utils/types";

const API_BASE_URL = "http://localhost:8000/api";

// --- Helper: Auth Headers ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found.");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// --- API Functions ---
const fetchSteps = async (): Promise<StepsData> =>
  (await axios.get(`${API_BASE_URL}/google/fitness/steps`, getAuthHeaders()))
    .data;

const fetchCalories = async (): Promise<CaloriesData> =>
  (await axios.get(`${API_BASE_URL}/google/fitness/calories`, getAuthHeaders()))
    .data;

const fetchActiveMinutes = async (): Promise<MinutesData> =>
  (
    await axios.get(
      `${API_BASE_URL}/google/fitness/active_minutes`,
      getAuthHeaders()
    )
  ).data;

const fetchCalendarEvents = async (): Promise<EventItem[]> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/events`,
    getAuthHeaders()
  );
  return res.data.events || [];
};

// --- Dashboard Component ---
const Dashboard: React.FC = () => {
  // --- State: Fitness + Calendar ---
  const [stepsData, setStepsData] = useState<StepsData | null>(null);
  const [caloriesData, setCaloriesData] = useState<CaloriesData | null>(null);
  const [minutesData, setMinutesData] = useState<MinutesData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);

  // Loading + Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<
    "steps" | "calories" | "minutes" | null
  >(null);

  // --- Fetch all data on mount ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [steps, calories, minutes, events] = await Promise.all([
          fetchSteps(),
          fetchCalories(),
          fetchActiveMinutes(),
          fetchCalendarEvents(),
        ]);
        setStepsData(steps);
        setCaloriesData(calories);
        setMinutesData(minutes);
        setEvents(events);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Update Goal Locally after API ---
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

  // --- UI RENDER ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500 text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">
          Track your daily goals and upcoming events
        </p>
      </header>

      {/* Fitness Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Today's Activity
          </h2>
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
              onSetGoal={() => setActiveModal("steps")}
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
              onSetGoal={() => setActiveModal("calories")}
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
              onSetGoal={() => setActiveModal("minutes")}
            />
          )}
        </div>
      </section>

      {/* Calendar Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Your Calendar
          </h2>
          <div className="h-[2px] bg-gray-300 flex-1 ml-4"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {events.length > 0 ? (
            <CalendarView events={events} />
          ) : (
            <p className="text-center text-gray-500">
              No upcoming events found.
            </p>
          )}
        </div>
      </section>

      {/* --- Goal Modals --- */}
      <GoalModal
        type="steps"
        isOpen={activeModal === "steps"}
        onClose={() => setActiveModal(null)}
        onSuccess={(newGoal) => handleGoalUpdate("steps", newGoal)}
      />
      <GoalModal
        type="calories"
        isOpen={activeModal === "calories"}
        onClose={() => setActiveModal(null)}
        onSuccess={(newGoal) => handleGoalUpdate("calories", newGoal)}
      />
      <GoalModal
        type="minutes"
        isOpen={activeModal === "minutes"}
        onClose={() => setActiveModal(null)}
        onSuccess={(newGoal) => handleGoalUpdate("minutes", newGoal)}
      />
    </div>
  );
};

export default Dashboard;
