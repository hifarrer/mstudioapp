"use client";

import { useState } from "react";
import SongWriters from "@/components/SongWriters";
import MusicProducers from "@/components/MusicProducers";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "song-writers" | "music-producers"
  >("song-writers");

  return (
    <main className="min-h-[calc(100vh-4rem)] text-[var(--text)]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-[var(--text)] tracking-[-0.02em]">
          Cadenze Studio
        </h1>
        <p className="text-[var(--muted)] mb-8">
          Create music and sounds with AI. Choose your flow below.
        </p>

        <div className="flex justify-center mb-8">
          <div className="rounded-[var(--radius)] p-1 flex gap-2 border border-white/10 bg-white/5">
            <button
              onClick={() => setActiveTab("song-writers")}
              className={`px-8 py-3 rounded-lg transition-all font-semibold text-sm ${
                activeTab === "song-writers"
                  ? "bg-gradient-to-b from-[var(--orange1)] to-[var(--orange2)] text-white shadow-[0_14px_40px_rgba(209,123,80,.2)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              Song Writers
            </button>
            <button
              onClick={() => setActiveTab("music-producers")}
              className={`px-8 py-3 rounded-lg transition-all font-semibold text-sm ${
                activeTab === "music-producers"
                  ? "bg-gradient-to-b from-[var(--orange1)] to-[var(--orange2)] text-white shadow-[0_14px_40px_rgba(209,123,80,.2)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              Music Producers
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === "song-writers" && <SongWriters />}
          {activeTab === "music-producers" && <MusicProducers />}
        </div>
      </div>
    </main>
  );
}
