import axios from "axios";
import type {
  EventItem,
  StepsData,
  CaloriesData,
  MinutesData,
} from "../utils/types";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found.");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchSteps = async (): Promise<StepsData> =>
  (await axios.get(`${API_BASE_URL}/google/fitness/steps`, getAuthHeaders()))
    .data;

export const fetchCalories = async (): Promise<CaloriesData> =>
  (await axios.get(`${API_BASE_URL}/google/fitness/calories`, getAuthHeaders()))
    .data;

export const fetchActiveMinutes = async (): Promise<MinutesData> =>
  (
    await axios.get(
      `${API_BASE_URL}/google/fitness/active_minutes`,
      getAuthHeaders()
    )
  ).data;

export const fetchCalendarEvents = async (): Promise<EventItem[]> =>
  (await axios.get(`${API_BASE_URL}/google/events`, getAuthHeaders())).data
    .events || [];

export const fetchJiraTickets = async (userId: string) =>
  (
    await axios.get(
      `${API_BASE_URL}/jira/tickets/high-priority?user_id=${userId}`,
      getAuthHeaders()
    )
  ).data.tickets || [];

export const fetchDailyWellnessScore = async (userId: string) =>
  (
    await axios.get(
      `${API_BASE_URL}/wellness/daily?user_id=${userId}`,
      getAuthHeaders()
    )
  ).data;

export const fetchOverallWellnessScore = async (userId: string) =>
  (
    await axios.get(
      `${API_BASE_URL}/wellness/overall?user_id=${userId}`,
      getAuthHeaders()
    )
  ).data;

export const fetchAIRecommendation = async (userId: string) =>
  (
    await axios.get(
      `${API_BASE_URL}/ai/recommendations?user_id=${userId}`,
      getAuthHeaders()
    )
  ).data;
