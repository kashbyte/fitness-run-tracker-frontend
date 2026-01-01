"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";

export default function RunSessionPage() {
  const params = useParams();
  const sessionId = params.id;

  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  // Fetch session info from backend
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

  // Countdown timer + client-side status
  useEffect(() => {
    if (!session || !session.startTime) return;

    const interval = setInterval(() => {
      const now = new Date();

      // Parse local startTime string exactly as entered (no UTC)
      const [datePart, timePart] = session.startTime.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);
      const startDate = new Date(year, month - 1, day, hour, minute);

      const diffMs = startDate - now;

      // Countdown display
      if (diffMs <= 0) {
        setCountdown("Started");
      } else {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }

      // Client-side status calculation
      const endDate = new Date(
        startDate.getTime() + session.duration * 60 * 1000
      );
      if (now < startDate) setCurrentStatus("scheduled");
      else if (now >= startDate && now <= endDate) setCurrentStatus("active");
      else setCurrentStatus("completed");
    }, 1000);

    return () => clearInterval(interval);
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

  if (error) return <div>{error}</div>;
  if (!session) return <div>Loading session...</div>;

  const canJoin =
    currentStatus === "scheduled" &&
    session.participants.length < session.maxParticipants;

  // Display startTime in 24-hour format exactly as entered
  const [datePart, timePart] = session.startTime.split("T");
  const formattedTime = `${datePart} ${timePart}`;

  return (
    <div
      style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Run Session</h1>

      <p>
        <strong>Session ID:</strong> {session.sessionId}
      </p>
      <p>
        <strong>Status:</strong> {currentStatus}
      </p>
      <p>
        <strong>Start Time:</strong> {formattedTime}
      </p>
      <p>
        <strong>Countdown:</strong> {countdown}
      </p>
      <p>
        <strong>Duration:</strong> {session.duration} minutes
      </p>

      <p>
        <strong>
          Participants ({session.participants.length}/{session.maxParticipants})
        </strong>
      </p>
      <ul>
        {session.participants.map((p, i) => (
          <li key={i}>{p.name}</li>
        ))}
      </ul>

      {canJoin && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleJoin} disabled={loading}>
            {loading ? "Joining..." : "Join Session"}
          </button>
        </div>
      )}

      {!canJoin && currentStatus !== "completed" && (
        <p>Joining closed or session is active</p>
      )}
    </div>
  );
}
