"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";

export default function ActivitySessionPage() {
  const params = useParams();
  const sessionId = params.id;

  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState("");

  const formatLocalDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-SG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const fetchSession = async () => {
    try {
      const res = await api.get(`/${sessionId}`);
      setSession(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch session");
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!session) return;

    const updateCountdown = () => {
      const now = new Date();
      const start = new Date(session.startTime);
      const diff = start.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Started");
        return;
      }

      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const handleJoin = async () => {
    if (!name) {
      alert("Enter your name to join");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/${sessionId}/join`, { name });
      alert("You joined the session!");
      setName("");
      fetchSession();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to join session");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div style={{ color: "#111" }}>{error}</div>;
  if (!session) return <div style={{ color: "#111" }}>Loading session...</div>;

  const canJoin =
    session.status === "scheduled" &&
    session.participants.length < session.maxParticipants;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F7F7",
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "28px 22px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "460px",
          color: "#111",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            marginBottom: "18px",
          }}
        >
          {session.activityType || "Activity"} Session
        </h1>

        <p style={{ fontSize: "14px", marginBottom: "6px" }}>
          <strong>Activity:</strong> {session.activityType || "Run"}
        </p>

        <p style={{ fontSize: "14px", marginBottom: "6px" }}>
          <strong>Status:</strong> {session.status}
        </p>

        <p style={{ fontSize: "14px", marginBottom: "6px" }}>
          <strong>Start Time:</strong> {formatLocalDate(session.startTime)}
        </p>

        <p style={{ fontSize: "14px", marginBottom: "6px" }}>
          <strong>Countdown:</strong> {countdown}
        </p>

        <p style={{ fontSize: "14px", marginBottom: "14px" }}>
          <strong>Duration:</strong> {session.duration} minutes
        </p>

        <div style={{ marginBottom: "16px" }}>
          <strong style={{ fontSize: "14px" }}>
            Participants ({session.participants.length}/
            {session.maxParticipants})
          </strong>
          <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
            {session.participants.map((p, i) => (
              <li key={i} style={{ fontSize: "14px", color: "#444" }}>
                {p.name}
              </li>
            ))}
          </ul>
        </div>

        {canJoin && (
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #DDD",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              style={{
                padding: "12px 16px",
                backgroundColor: "#FC4C02",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {loading ? "..." : "Join"}
            </button>
          </div>
        )}

        {!canJoin && session.status !== "completed" && (
          <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
            Joining closed or session is active
          </p>
        )}
      </div>
    </div>
  );
}
