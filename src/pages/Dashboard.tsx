import React, { useEffect, useState } from "react";
import axios from "axios";

// Import components
import CalendarView from "../components/CalendarView";
import FitnessCard from "../components/FitnessCard";

// Import types
import type {
  EventItem,
  StepsData,
  CaloriesData,
  MinutesData,
} from "../utils/types"; // Assuming types are at `src/utils/types.ts`

// --- API Fetching Logic ---

const API_BASE_URL = "http://localhost:8000/api";

// Helper function to get the auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found.");
  }
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// API Functions
const fetchSteps = async (): Promise<StepsData> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/fitness/steps`,
    getAuthHeaders()
  );
  return res.data;
};

const fetchCalories = async (): Promise<CaloriesData> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/fitness/calories`,
    getAuthHeaders()
  );
  return res.data;
};

const fetchActiveMinutes = async (): Promise<MinutesData> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/fitness/active_minutes`,
    getAuthHeaders()
  );
  return res.data;
};

const fetchCalendarEvents = async (): Promise<EventItem[]> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/events`,
    getAuthHeaders()
  );
  return res.data.events || [];
};

// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  // --- STATE ---

  // Calendar State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Fitness State
  const [stepsData, setStepsData] = useState<StepsData | null>(null);
  const [caloriesData, setCaloriesData] = useState<CaloriesData | null>(null);
  const [minutesData, setMinutesData] = useState<MinutesData | null>(null);
  const [loadingFitness, setLoadingFitness] = useState(true);
  const [fitnessError, setFitnessError] = useState<string | null>(null);

  // --- EFFECTS ---

  // Effect for fetching ALL data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoadingEvents(true);
      setLoadingFitness(true);
      setEventsError(null);
      setFitnessError(null);

      try {
        // Fetch all data in parallel
        const [eventData, stepsRes, caloriesRes, minutesRes] =
          await Promise.all([
            fetchCalendarEvents(),
            fetchSteps(),
            fetchCalories(),
            fetchActiveMinutes(),
          ]);

        // Set all states at once
        setEvents(eventData);
        setStepsData(stepsRes);
        setCaloriesData(caloriesRes);
        setMinutesData(minutesRes);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        // Set a generic error for simplicity
        setEventsError(err.message || "Failed to load calendar data.");
        setFitnessError(err.message || "Failed to load fitness data.");
      } finally {
        setLoadingEvents(false);
        setLoadingFitness(false);
      }
    };

    loadData();
  }, []); // Empty dependency array ensures this runs once on mount

  // --- RENDER HELPERS ---

  const renderFitnessSection = () => {
    if (loadingFitness) {
      return (
        <div className="text-center text-gray-500">Loading activity...</div>
      );
    }
    if (fitnessError) {
      return (
        <div className="text-center text-red-500">Error: {fitnessError}</div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stepsData ? (
          <FitnessCard
            title="Steps"
            value={stepsData.steps_completed}
            goal={stepsData.step_goal}
            unit="steps"
            iconType="steps"
            colorClass="text-blue-500"
          />
        ) : (
          <p>Could not load steps data.</p>
        )}

        {caloriesData ? (
          <FitnessCard
            title="Calories"
            value={caloriesData.calories_burned}
            goal={caloriesData.calorie_goal}
            unit="kcal"
            iconType="calories"
            colorClass="text-orange-500"
          />
        ) : (
          <p>Could not load calories data.</p>
        )}

        {minutesData ? (
          <FitnessCard
            title="Active Minutes"
            value={minutesData.active_minutes}
            goal={minutesData.active_minute_goal}
            unit="mins"
            iconType="minutes"
            colorClass="text-green-500"
          />
        ) : (
          <p>Could not load active minutes data.</p>
        )}
      </div>
    );
  };

  const renderCalendarSection = () => {
    if (loadingEvents) {
      return <p className="text-center text-gray-500">Loading calendar...</p>;
    }
    if (eventsError) {
      return (
        <div className="text-center text-red-500">Error: {eventsError}</div>
      );
    }
    // Assuming you have a CalendarView component
    return <CalendarView events={events} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Dashboard
      </h2>

      {/* --- Fitness Section --- */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          Today's Activity
        </h3>
        {renderFitnessSection()}
      </div>

      {/* --- Calendar Section --- */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Calendar</h3>
        {renderCalendarSection()}
      </div>
    </div>
  );
};

export default Dashboard;
