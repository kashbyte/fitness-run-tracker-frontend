"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F7F7",
        padding: "24px 20px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginTop: "40px", marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#111",
            marginBottom: "8px",
          }}
        >
          Run Tracker
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            maxWidth: "280px",
            lineHeight: "1.5",
          }}
        >
          Track group runs, join sessions, and stay accountable.
        </p>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <button
        onClick={() => router.push("/create")}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: "#FC4C02",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(252, 76, 2, 0.3)",
        }}
      >
        Create Run
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
          marginTop: "14px",
        }}
      >
        Runs are visible to participants only
      </p>
    </div>
  );
}
