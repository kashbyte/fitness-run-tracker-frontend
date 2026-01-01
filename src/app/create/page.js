"use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function CreateRun() {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !startTime || !duration || !maxParticipants) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/create", {
        name,
        startTime,
        duration: Number(duration),
        maxParticipants: Number(maxParticipants),
      });
      alert("Run created! Session ID: " + res.data.sessionId);
      // Optionally redirect to the session page:
      // window.location.href = `/run/${res.data.sessionId}`;
    } catch (err) {
      console.error(err);
      alert("Failed to create run");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Create Run Session</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Participants"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Run"}
        </button>
      </form>
    </div>
  );
}
