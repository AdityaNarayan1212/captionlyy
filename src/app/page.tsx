"use client";

import { Hero } from "@/components/home/hero";
import { ImageUploader } from "@/components/home/image-uploader";
import { AnalyzeButton } from "@/components/home/analyze-button";
import { VibeDisplay } from "@/components/home/vibe-display";
import { InsightsPanel } from "@/components/home/insights-panel";
import { MoodSlider } from "@/components/home/mood-slider";
import { ExtraControls } from "@/components/home/extra-controls";
import { CaptionGenerator } from "@/components/home/caption-generator";
import { PhotoDump } from "@/components/home/photo-dump";
import { useCaptionly } from "@/context/captionly-context";

export default function HomePage() {
  const { analysis } = useCaptionly();

  return (
    <div className="space-y-10">
      <Hero />
      <ImageUploader />
      <AnalyzeButton />

      {analysis && (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            <VibeDisplay />
            <MoodSlider />
            <ExtraControls />
            <CaptionGenerator />
            <PhotoDump />
          </div>
          <InsightsPanel />
        </div>
      )}
    </div>
  );
}
