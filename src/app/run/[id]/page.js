"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // App Router
import { api } from "../../../lib/api"; // must match folder structure exactly

export default function RunSessionPage() {
  const params = useParams();
  const sessionId = params.id;

  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleJoin = async () => {
    if (!name) {
      alert("Enter your name to join");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/${sessionId}/join`, { name });
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
        <strong>Start Time:</strong>{" "}
        {new Date(session.startTime).toLocaleString()}
      </p>
      <p>
        <strong>Duration:</strong> {session.duration} minutes
      </p>
      <p>
        <strong>
          Participants ({session.participants.length}/{session.maxParticipants}
          ):
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
