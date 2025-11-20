import axios from "axios";
import type { Attendance } from "../utils/types";

const API_BASE_URL = "http://localhost:8000/api";

// Use same auth header method as fitness APIs
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found.");
  }
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// --- GET TODAY'S ATTENDANCE ---
export const fetchTodayAttendance = async (): Promise<Attendance | null> => {
  const res = await axios.get(
    `${API_BASE_URL}/attendance/today`,
    getAuthHeaders()
  );
  return res.data;
};

// --- CHECK-IN ---
export const sendCheckin = async (mood: number) => {
  const res = await axios.post(
    `${API_BASE_URL}/attendance/checkin`,
    { mood },
    getAuthHeaders()
  );
  return res.data;
};

// --- CHECK-OUT ---
export const sendCheckout = async (employee_id: string): Promise<any> => {
  const res = await axios.post(
    `${API_BASE_URL}/attendance/checkout`,
    { employee_id },
    getAuthHeaders()
  );
  return res.data;
};
