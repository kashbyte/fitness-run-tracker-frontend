"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function CreateRunPage() {
  const router = useRouter();

  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!startTime || !duration || !maxParticipants) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/create", {
        startTime,
        duration: parseInt(duration),
        maxParticipants: parseInt(maxParticipants),
      });

      router.push(`/run/${res.data.sessionId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Create Run Session</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label>
            Start Time:
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                width: "calc(100% - 20px)",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ padding: "8px", width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <input
            type="number"
            placeholder="Max Participants"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            style={{ padding: "8px", width: "100%" }}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
      </div>
    </div>
  );
}
