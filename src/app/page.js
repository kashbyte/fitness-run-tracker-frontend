"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "100%",
          maxWidth: "380px",
          padding: "30px 25px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            color: "#2E7D32",
            fontSize: "26px",
          }}
        >
          Run Tracker
        </h1>

        <p
          style={{
            marginBottom: "25px",
            color: "#555",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          Create and join running sessions with live countdowns and
          participants.
        </p>

        <button
          onClick={() => router.push("/create")}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Create Run
        </button>
      </div>
    </div>
  );
}
