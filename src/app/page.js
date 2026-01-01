"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h2>Run Tracker</h2>
      <button onClick={() => router.push("/create")}>Create Run</button>
    </div>
  );
}
