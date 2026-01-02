"use client";

import "./globals.css";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Fitness Tracker</title>
      </head>
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Navbar */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#FC4C02",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            zIndex: 100,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Fitness Tracker
          </h1>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "20px",
              display: "block",
              cursor: "pointer",
            }}
          >
            ☰
          </button>

          {/* Desktop links */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              marginLeft: "auto",
            }}
            className="desktop-menu"
          >
            <button
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontWeight: pathname === "/" ? "700" : "500",
                cursor: "pointer",
              }}
            >
              Home
            </button>
            <button
              onClick={() => router.push("/create")}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontWeight: pathname === "/create" ? "700" : "500",
                cursor: "pointer",
              }}
            >
              Create Activity
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "56px",
              right: 0,
              backgroundColor: "#FC4C02",
              width: "100%",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
            className="mobile-menu"
          >
            <button
              onClick={() => {
                router.push("/");
                setMenuOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "white",
                textAlign: "left",
                fontSize: "16px",
              }}
            >
              Home
            </button>
            <button
              onClick={() => {
                router.push("/create");
                setMenuOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "white",
                textAlign: "left",
                fontSize: "16px",
              }}
            >
              Create Activity
            </button>
          </div>
        )}

        {/* Page content */}
        <main>{children}</main>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "16px 8px",
            backgroundColor: "#F7F7F7",
            color: "#333",
            borderTop: "1px solid #DDD",
            marginTop: "32px",
          }}
        >
          &copy; {new Date().getFullYear()} Fitness Tracker
        </footer>
      </body>
    </html>
  );
}
