"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function CreateRunPage() {
  const router = useRouter();

  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [activityType, setActivityType] = useState("run");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!startTime || !duration || !maxParticipants || !activityType) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const start = new Date(startTime);

      // Correct API endpoint
      const res = await api.post("/runs/create", {
        startTime: start.toISOString(),
        duration: parseInt(duration),
        maxParticipants: parseInt(maxParticipants),
        activityType: activityType.toLowerCase(),
      });

      // Navigate to generic session page
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
          maxWidth: "420px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            marginBottom: "6px",
            color: "#111",
          }}
        >
          Create Session
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "24px",
          }}
        >
          Schedule an activity and invite participants
        </p>

        {error && (
          <p
            style={{ color: "#D32F2F", fontSize: "14px", marginBottom: "12px" }}
          >
            {error}
          </p>
        )}

        {/* Activity type */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#333",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Activity Type
          </label>
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #DDD",
              fontSize: "14px",
            }}
          >
            <option value="run">Run</option>
            <option value="gym">Gym</option>
            <option value="sport">Sport</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Start time */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#333",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #DDD",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Duration */}
        <div style={{ marginBottom: "18px" }}>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #DDD",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Max participants */}
        <div style={{ marginBottom: "26px" }}>
          <input
            type="number"
            placeholder="Max Participants"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #DDD",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#FC4C02",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(252,76,2,0.3)",
          }}
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
      </div>
    </div>
  );
}
