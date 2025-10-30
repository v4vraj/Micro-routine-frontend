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

  // Handle OAuth redirect results or initial load
  useEffect(() => {
    const connected = searchParams.get("connected") as Provider | null;
    const connectionStatus = searchParams.get("status");
    const msg = searchParams.get("msg");
    const userId = searchParams.get("user_id");

    if (connected && connectionStatus === "success") {
      console.log(`${connected} connected successfully for user ${userId}`);
      setStatus((prev) => ({ ...prev, [connected]: true }));
      setSearchParams({});
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
        window.location.href = authUrl;
      }
    } catch (err: any) {
      console.error("Error in handleToggle:", err);
      alert(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Permission Management</h2>

      <div className="flex flex-col gap-6 w-72">
        {(["google", "jira"] as Provider[]).map((provider) => (
          <div
            key={provider}
            className="flex justify-between items-center bg-white shadow-md rounded-lg px-5 py-3 border"
          >
            <span className="capitalize text-lg">{provider}</span>

            <button
              onClick={() => handleToggle(provider)}
              disabled={loading === provider}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                status[provider] ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                  status[provider] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Permission;
