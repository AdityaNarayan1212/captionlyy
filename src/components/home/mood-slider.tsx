"use client";

import { useCaptionly } from "@/context/captionly-context";
import { getMoodLabel } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

const MOOD_MARKERS = [
  { value: 0, label: "calm" },
  { value: 25, label: "aesthetic" },
  { value: 50, label: "cool" },
  { value: 75, label: "energetic" },
  { value: 100, label: "chaotic" },
];

export function MoodSlider() {
  const { settings, updateSettings } = useCaptionly();
  const currentLabel = getMoodLabel(settings.mood);

  return (
    <div className="rounded-3xl glass p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Mood Slider</h3>
        <motion.span
          key={currentLabel}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-violet-100"
        >
          {currentLabel}
        </motion.span>
      </div>

      <Slider
        value={[settings.mood]}
        onValueChange={(value) => {
          const mood = typeof value === "number" ? value : value[0];
          updateSettings({ mood });
        }}
        max={100}
        step={1}
        className="py-2"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        {MOOD_MARKERS.map((m) => (
          <span key={m.value} className="capitalize">
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
