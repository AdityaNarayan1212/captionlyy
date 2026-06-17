"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useCaptionly } from "@/context/captionly-context";
import { CaptionCard } from "./caption-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaptionLength } from "@/lib/types";

export function CaptionGenerator() {
  const {
    analysis,
    captions,
    isGenerating,
    generate,
    regenerateCaption,
    settings,
  } = useCaptionly();

  const prevSettings = useRef(settings);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!analysis) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      generate();
      prevSettings.current = settings;
      return;
    }

    const changed =
      prevSettings.current.mood !== settings.mood ||
      prevSettings.current.tone !== settings.tone ||
      prevSettings.current.emojiLevel !== settings.emojiLevel ||
      prevSettings.current.capitalization !== settings.capitalization ||
      prevSettings.current.platform !== settings.platform ||
      prevSettings.current.style !== settings.style;

    if (changed) {
      prevSettings.current = settings;
      generate();
    }
  }, [analysis, settings, generate]);

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl glass p-5 sm:p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          {settings.style} Captions
        </h3>
        {isGenerating && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {!captions && isGenerating ? (
        <div className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-rose-400 mb-3" />
          <p className="text-sm text-muted-foreground">
            Crafting {settings.style.toLowerCase()} captions...
          </p>
        </div>
      ) : captions ? (
        <Tabs defaultValue="short">
          <TabsList className="rounded-xl w-full">
            <TabsTrigger value="short" className="rounded-lg flex-1">
              Short
            </TabsTrigger>
            <TabsTrigger value="medium" className="rounded-lg flex-1">
              Medium
            </TabsTrigger>
            <TabsTrigger value="long" className="rounded-lg flex-1">
              Long
            </TabsTrigger>
          </TabsList>

          {(["short", "medium", "long"] as CaptionLength[]).map((length) => (
            <TabsContent key={length} value={length} className="space-y-3 mt-4">
              {captions[length].map((caption, index) => (
                <CaptionCard
                  key={caption.id}
                  caption={caption}
                  isRegenerating={isGenerating}
                  onRegenerate={() => regenerateCaption(length, index)}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      ) : null}
    </motion.div>
  );
}
