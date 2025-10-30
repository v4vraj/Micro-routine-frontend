import axios from "axios";

const BACKEND_URL = "http://localhost:8000"; // update if needed

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");
  return { Authorization: `Bearer ${token}` };
};

export const getGoogleAuthUrl = async () => {
  const res = await axios.get(`${BACKEND_URL}/permissions/google/connect`, {
    headers: getAuthHeaders(),
  });
  return res.data.auth_url;
};

export const getJiraAuthUrl = async () => {
  const res = await axios.get(`${BACKEND_URL}/permissions/jira/connect`, {
    headers: getAuthHeaders(),
  });
  return res.data.auth_url;
};

export const getConnectionStatus = async (): Promise<{
  google: boolean;
  jira: boolean;
}> => {
  const res = await axios.get(`${BACKEND_URL}/permissions/status`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const disconnectProvider = async (
  provider: "google" | "jira"
): Promise<void> => {
  await axios.post(
    `${BACKEND_URL}/${provider}/disconnect`,
    {},
    { headers: getAuthHeaders() }
  );
};
