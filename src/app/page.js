"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api"; // make sure baseURL points to your deployed backend

export default function Home() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/");
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

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

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Run Tracker</h1>
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
        Create Run
      </button>

      {sessions.length === 0 && <p>No sessions yet</p>}

      {sessions.map((s) => (
        <div
          key={s.sessionId}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <p>
            <strong>ID:</strong> {s.sessionId}
          </p>
          <p>
            <strong>Status:</strong> {s.status}
          </p>
          <p>
            <strong>Start:</strong> {formatLocalDate(s.startTime)}
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
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Join Session
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
