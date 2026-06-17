"use client";

import { motion } from "framer-motion";
import { useCaptionly } from "@/context/captionly-context";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VibeDisplay() {
  const { analysis, isAnalyzing } = useCaptionly();

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl glass p-8 text-center"
      >
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-rose-400 mb-4" />
        <p className="text-lg font-medium">Reading your vibe...</p>
        <p className="text-sm text-muted-foreground mt-1">
          Analyzing scenery, mood, colors, and energy
        </p>
      </motion.div>
    );
  }

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl glass p-6 sm:p-8 space-y-6"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-100 to-violet-100 px-4 py-1.5 text-sm font-medium">
          <Wand2 className="h-3.5 w-3.5 text-rose-500" />
          Vibe Analysis Complete
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {analysis.vibeStatement}
        </h2>
        <p className="text-muted-foreground">
          Photo vibe score:{" "}
          <span className="font-semibold text-foreground">
            {analysis.vibeScore}/100
          </span>
        </p>
      </div>

      <div className="relative h-3 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${analysis.vibeScore}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-400 via-violet-400 to-indigo-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {[
          { label: "Mood", value: analysis.mood },
          { label: "Lighting", value: analysis.lighting },
          { label: "Activity", value: analysis.activity },
          { label: "Season", value: analysis.season },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white/50 p-3 backdrop-blur-sm"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium mt-0.5 capitalize truncate">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
