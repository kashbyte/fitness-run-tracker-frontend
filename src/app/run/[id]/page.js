"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { use } from "react";

export default function RunSession({ params }) {
  const { id } = use(params);
  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  // Fetch session initially
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/runs/${id}`);
        setSession(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSession();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const start = new Date(session.startTime);
      const now = new Date();
      const diff = Math.floor((start - now) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Poll backend for status
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/runs/${session.sessionId}`);
        setSession(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [session]);

  const joinRun = async () => {
    if (!name) {
      setError("Please enter your name");
      return;
    }

    try {
      const res = await api.post(`/runs/${id}/join`, { name });
      setSession(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join run");
    }
  };

  if (!session) return <p>Loading...</p>;

  const canJoin =
    session.status === "scheduled" &&
    (session.participants?.length ?? 0) < Number(session.maxParticipants);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Run Session</h2>

      <p>
        Status: <strong>{session.status}</strong>
      </p>
      <p>Starts in: {timeLeft}s</p>
      <p>
        Participants: {session.participants.length} / {session.maxParticipants}
      </p>

      {canJoin ? (
        <>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          />
          <button
            onClick={joinRun}
            style={{ width: "100%", padding: "10px", marginBottom: "8px" }}
          >
            Join Run
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : session.status === "active" ? (
        <p style={{ color: "orange" }}>
          Run is in progress. Joining is closed.
        </p>
      ) : session.status === "completed" ? (
        <p style={{ color: "green" }}>Run has ended.</p>
      ) : (
        <p style={{ color: "red" }}>Participant limit reached</p>
      )}

      <h3>Participants</h3>
      <ul>
        {session.participants.map((p, i) => (
          <li key={i}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
