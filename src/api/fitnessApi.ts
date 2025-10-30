import axios from "axios";
import type {
  StepsData,
  CaloriesData,
  MinutesData,
  EventItem,
} from "../utils/types";

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

const API_BASE_URL = "http://localhost:8000/api";

export const fetchSteps = async (): Promise<StepsData> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/fitness/steps`,
    getAuthHeaders()
  );
  return res.data;
};

export const fetchCalories = async (): Promise<CaloriesData> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/fitness/calories`,
    getAuthHeaders()
  );
  return res.data;
};

export const fetchActiveMinutes = async (): Promise<MinutesData> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/fitness/active_minutes`,
    getAuthHeaders()
  );
  return res.data;
};

export const fetchCalendarEvents = async (): Promise<EventItem[]> => {
  const res = await axios.get(
    `${API_BASE_URL}/google/events`,
    getAuthHeaders()
  );
  return res.data.events || [];
};
