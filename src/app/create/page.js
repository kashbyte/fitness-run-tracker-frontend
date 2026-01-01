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
      // Convert local datetime to Singapore time in ISO format
      const localDate = new Date(startTime);
      const sgOffset = 8 * 60; // Singapore is UTC+8
      const startTimeSG = new Date(
        localDate.getTime() + (sgOffset - localDate.getTimezoneOffset()) * 60000
      );

      const res = await api.post("/create", {
        startTime: startTimeSG.toISOString(),
        duration: parseInt(duration),
        maxParticipants: parseInt(maxParticipants),
      });

      const sessionId = res.data.sessionId;

      // Redirect to the session page
      router.push(`/run/${sessionId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create run");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Create Run Session</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Max Participants"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
        />
      </div>

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Session"}
      </button>
    </div>
  );
}
