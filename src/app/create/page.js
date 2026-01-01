"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function CreateRun() {
  const router = useRouter();
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const createRun = async () => {
    if (!startTime || !duration || !maxParticipants) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/runs/create", {
        startTime,
        duration: Number(duration),
        maxParticipants: Number(maxParticipants),
      });
      router.push(`/run/${res.data.sessionId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create run");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Create Run Session</h2>

      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        placeholder="Start Time"
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
      />

      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (minutes)"
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
      />

      <input
        type="number"
        value={maxParticipants}
        onChange={(e) => setMaxParticipants(e.target.value)}
        placeholder="Max Participants"
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
      />

      <button
        onClick={createRun}
        style={{ width: "100%", padding: "10px" }}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Run"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
