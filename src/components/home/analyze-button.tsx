"use client";

import { useCaptionly } from "@/context/captionly-context";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AnalyzeButton() {
  const {
    images,
    analysis,
    isAnalyzing,
    analyze,
    reset,
    generate,
    isGenerating,
  } = useCaptionly();

  if (images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {!analysis ? (
          <Button
            size="lg"
            onClick={analyze}
            disabled={isAnalyzing}
            className="rounded-2xl gap-2 px-8 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 shadow-lg shadow-rose-200/50 text-white border-0"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isAnalyzing ? "Analyzing Vibe..." : "Analyze My Vibe"}
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              onClick={generate}
              disabled={isGenerating}
              className="rounded-2xl gap-2 px-6 bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 shadow-lg shadow-rose-200/50 text-white border-0"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Regenerate All
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={reset}
              className="rounded-2xl gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
