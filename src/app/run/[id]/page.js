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
    const interval = setInterval(fetchSession, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(session.startTime);
      const diff = start.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Session has started");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
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
    session.status === "scheduled" &&
    session.participants.length < session.maxParticipants;

  // Display start time in Singapore timezone
  const startDate = new Date(session.startTime);
  const formattedStartTime = startDate.toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>Run Session</h1>

      <p>
        <strong>Session ID:</strong> {session.sessionId}
      </p>
      <p>
        <strong>Status:</strong> {session.status}
      </p>
      <p>
        <strong>Start Time:</strong> {formattedStartTime}
      </p>
      {session.status === "scheduled" && (
        <p>
          <strong>Countdown:</strong> {countdown}
        </p>
      )}
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

      {session.status === "completed" && <p>Session is completed</p>}

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

      {!canJoin && session.status !== "completed" && (
        <p>Joining closed or session is active</p>
      )}
    </div>
  );
}
