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

  // Countdown logic
  useEffect(() => {
    fetchSession();
    const interval = setInterval(() => {
      fetchSession(); // refresh participants

      if (session) {
        // Treat startTime as **local time string** directly
        const start = new Date(session.startTimeLocal); // we'll store this in backend
        const now = new Date();
        const diff = start - now;

        if (diff <= 0) {
          setCountdown("Started");
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
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

  // Display the **exact start time string** the user picked
  const startTimeDisplay = session.startTimeLocal;

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
        <strong>Start Time:</strong> {startTimeDisplay}
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
