"use client";

import { useState } from "react";
import SongWriters from "@/components/SongWriters";
import MusicProducers from "@/components/MusicProducers";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"song-writers" | "music-producers">("song-writers");

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Music Studio
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 rounded-lg p-1 flex gap-2 border border-gray-800">
            <button
              onClick={() => setActiveTab("song-writers")}
              className={`px-8 py-3 rounded-md transition-all font-semibold ${
                activeTab === "song-writers"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Song Writers
            </button>
            <button
              onClick={() => setActiveTab("music-producers")}
              className={`px-8 py-3 rounded-md transition-all font-semibold ${
                activeTab === "music-producers"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Music Producers
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "song-writers" && <SongWriters />}
          {activeTab === "music-producers" && <MusicProducers />}
        </div>
      </div>
    </main>
  );
}
