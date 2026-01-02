"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function Home() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});

  const formatLocalDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-SG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Fetch all sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/runs"); // matches backend /runs route
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (sessions.length === 0) return;

    const updateCountdowns = () => {
      const now = new Date();
      const newCountdowns = {};

      sessions.forEach((s) => {
        const start = new Date(s.startTime);
        const diff = start.getTime() - now.getTime();

        if (diff <= 0) {
          newCountdowns[s.sessionId] = "Started";
        } else {
          const hours = Math.floor(diff / 1000 / 60 / 60);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          newCountdowns[s.sessionId] = `${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const timer = setInterval(updateCountdowns, 1000);
    return () => clearInterval(timer);
  }, [sessions]);

  if (loading)
    return <div style={{ padding: "20px" }}>Loading sessions...</div>;

  const getStatusColor = (status) => {
    if (status === "scheduled") return "#28a745"; // green for open
    if (status === "active") return "#ff9800"; // orange for active
    if (status === "completed") return "#6c757d"; // grey for completed
    return "#000";
  };

  const getButtonColor = (status) => {
    if (status === "scheduled") return "#28a745"; // green
    if (status === "active") return "#ff9800"; // orange
    return "#6c757d"; // grey
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}>
        Activity Tracker
      </h1>
      <button
        onClick={() => router.push("/create")}
        style={{
          backgroundColor: "#FF5A5F",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          width: "100%",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Create Activity
      </button>

      {sessions.length === 0 && (
        <p style={{ color: "#000" }}>No sessions yet</p>
      )}

      {sessions.map((s) => (
        <div
          key={s.sessionId}
          style={{
            borderLeft: `6px solid ${getStatusColor(s.status)}`,
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          <p>
            <strong>ID:</strong> {s.sessionId}
          </p>
          <p>
            <strong>Activity:</strong> {s.activityType || "Run"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{ color: getStatusColor(s.status), fontWeight: "bold" }}
            >
              {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
            </span>
          </p>
          <p>
            <strong>Start:</strong> {formatLocalDate(s.startTime)}
          </p>
          <p>
            <strong>Countdown:</strong>{" "}
            <span
              style={{ color: getStatusColor(s.status), fontWeight: "bold" }}
            >
              {countdowns[s.sessionId]}
            </span>
          </p>
          <p>
            <strong>Duration:</strong> {s.duration} min
          </p>
          <p>
            <strong>
              Participants: {s.participants.length}/{s.maxParticipants}
            </strong>
          </p>

          {s.status === "scheduled" &&
          s.participants.length < s.maxParticipants ? (
            <button
              onClick={() => router.push(`/run/${s.sessionId}`)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: getButtonColor(s.status),
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Join {s.activityType || "Run"}
            </button>
          ) : (
            <p style={{ marginTop: "10px", color: "#888" }}>
              {s.status === "completed" ? "Completed" : "Full / Active"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
