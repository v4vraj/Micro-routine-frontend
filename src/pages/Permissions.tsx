import { useEffect, useState } from "react";
import {
  getGoogleAuthUrl,
  getJiraAuthUrl,
  getConnectionStatus,
  disconnectProvider,
} from "../api/permissionApi";
import { useSearchParams } from "react-router-dom";

type Provider = "google" | "jira";

interface ConnectionStatus {
  google: boolean;
  jira: boolean;
}

const Permission = () => {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>({
    google: false,
    jira: false,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Handle OAuth redirect results or initial load
  useEffect(() => {
    const connected = searchParams.get("connected") as Provider | null;
    const connectionStatus = searchParams.get("status");
    const msg = searchParams.get("msg");
    const userId = searchParams.get("user_id");

    if (connected && connectionStatus === "success") {
      console.log(`${connected} connected successfully for user ${userId}`);
      setStatus((prev) => ({ ...prev, [connected]: true }));
      setSearchParams({});
      if (userId) {
        localStorage.setItem("user_id", userId);
      }
    } else if (connected && connectionStatus === "error") {
      alert(`Failed to connect ${connected}: ${msg || "Unknown error"}`);
      setSearchParams({});
    } else if (!connected) {
      (async () => {
        try {
          const data = await getConnectionStatus();
          setStatus(data);
        } catch (err) {
          console.error("Failed to load connection status:", err);
        }
      })();
    }
  }, [searchParams, setSearchParams]);

  const handleToggle = async (provider: Provider) => {
    const isConnected = status[provider];
    setLoading(provider);

    try {
      if (isConnected) {
        await disconnectProvider(provider);
        setStatus((prev) => ({ ...prev, [provider]: false }));
      } else {
        const authUrl =
          provider === "google"
            ? await getGoogleAuthUrl()
            : await getJiraAuthUrl();

        // ✅ Extract and store user_id (state) from Jira auth URL
        if (provider === "jira") {
          try {
            const url = new URL(authUrl);
            const userId = url.searchParams.get("state");
            if (userId) {
              localStorage.setItem("user_id", userId);
              console.log("Stored user_id from Jira state:", userId);
            } else {
              console.warn("No user_id (state) found in Jira auth URL");
            }
          } catch (error) {
            console.error("Error extracting user_id from Jira URL:", error);
          }

          // 👉 Open Jira in a new tab
          window.open(authUrl, "_blank", "noopener,noreferrer");
        } else {
          // 👉 Redirect Google in same tab
          window.location.href = authUrl;
        }
      }
    } catch (err: any) {
      console.error("Error in handleToggle:", err);
      alert(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Manage Permissions
        </h2>

        <div className="space-y-6">
          {(["google", "jira"] as Provider[]).map((provider) => (
            <div
              key={provider}
              className="flex justify-between items-center bg-gray-50 border rounded-lg px-5 py-4 hover:shadow-md transition-all"
            >
              <span className="capitalize text-lg font-medium text-gray-700">
                {provider}
              </span>

              <button
                onClick={() => handleToggle(provider)}
                disabled={loading === provider}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                  status[provider] ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                    status[provider] ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Permission;
