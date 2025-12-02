"use client";

import { useState } from "react";
import AudioToAudio from "@/components/AudioToAudio";
import TextToAudio from "@/components/TextToAudio";
import AudioEdit from "@/components/AudioEdit";
import StemSeparation from "@/components/StemSeparation";
import SoundEffects from "@/components/SoundEffects";
import ForcedAlignment from "@/components/ForcedAlignment";
import AudioIsolation from "@/components/AudioIsolation";
import Dubbing from "@/components/Dubbing";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"audio-to-audio" | "text-to-audio" | "audio-edit" | "stem-separation" | "sound-effects" | "forced-alignment" | "audio-isolation" | "dubbing">("audio-to-audio");

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
              onClick={() => setActiveTab("audio-to-audio")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "audio-to-audio"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Audio to Audio
            </button>
            <button
              onClick={() => setActiveTab("text-to-audio")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "text-to-audio"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Text to Audio
            </button>
            <button
              onClick={() => setActiveTab("audio-edit")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "audio-edit"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Audio Edit
            </button>
            <button
              onClick={() => setActiveTab("stem-separation")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "stem-separation"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              STEM Separation
            </button>
            <button
              onClick={() => setActiveTab("sound-effects")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "sound-effects"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sound Effects
            </button>
            <button
              onClick={() => setActiveTab("forced-alignment")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "forced-alignment"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Forced Alignment
            </button>
            <button
              onClick={() => setActiveTab("audio-isolation")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "audio-isolation"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Audio Isolation
            </button>
            <button
              onClick={() => setActiveTab("dubbing")}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === "dubbing"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Dubbing
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "audio-to-audio" && <AudioToAudio />}
          {activeTab === "text-to-audio" && <TextToAudio />}
          {activeTab === "audio-edit" && <AudioEdit />}
          {activeTab === "stem-separation" && <StemSeparation />}
          {activeTab === "sound-effects" && <SoundEffects />}
          {activeTab === "forced-alignment" && <ForcedAlignment />}
          {activeTab === "audio-isolation" && <AudioIsolation />}
          {activeTab === "dubbing" && <Dubbing />}
        </div>
      </div>
    </main>
  );
}

