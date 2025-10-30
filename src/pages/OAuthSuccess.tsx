import { useEffect, useState } from "react";

const OAuthSuccess: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get("status")); // "success" or "error"
    setMsg(params.get("msg")); // optional message from backend
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {status === "success" ? (
        <>
          <h2 style={{ color: "green" }}>✅ OAuth Successful!</h2>
          <p>You can now use your connected account.</p>
        </>
      ) : (
        <>
          <h2 style={{ color: "red" }}>❌ OAuth Failed</h2>
          <p>{msg || "Something went wrong during authentication."}</p>
        </>
      )}
    </div>
  );
};

export default OAuthSuccess;
