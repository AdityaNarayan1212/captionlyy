"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  UploadedImage,
  PhotoAnalysis,
  CaptionSet,
  GenerationSettings,
  PhotoDumpContent,
  CaptionStyle,
  Tone,
  EmojiLevel,
  Capitalization,
  Platform,
  CaptionLength,
} from "@/lib/types";
import {
  analyzeImages,
  generateCaptions,
  regenerateSingleCaption,
  generatePhotoDump,
} from "@/lib/ai/gemini";
import { extractDominantColors, revokeImagePreview } from "@/lib/image";

interface CaptionlyContextType {
  images: UploadedImage[];
  setImages: (images: UploadedImage[]) => void;
  analysis: PhotoAnalysis | null;
  captions: CaptionSet | null;
  photoDump: PhotoDumpContent | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  settings: GenerationSettings;
  updateSettings: (partial: Partial<GenerationSettings>) => void;
  analyze: () => Promise<void>;
  generate: () => Promise<void>;
  regenerateCaption: (
    length: CaptionLength,
    index: number
  ) => Promise<void>;
  reset: () => void;
}

const defaultSettings: GenerationSettings = {
  mood: 50,
  tone: "confident",
  emojiLevel: "low",
  capitalization: "normal",
  platform: "Instagram",
  style: "Aesthetic",
};

const CaptionlyContext = createContext<CaptionlyContextType | null>(null);

export function CaptionlyProvider({ children }: { children: ReactNode }) {
  const [images, setImagesState] = useState<UploadedImage[]>([]);
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [captions, setCaptions] = useState<CaptionSet | null>(null);
  const [photoDump, setPhotoDump] = useState<PhotoDumpContent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);

  const setImages = useCallback((newImages: UploadedImage[]) => {
    setImagesState((prev) => {
      revokeImagePreview(prev);
      return newImages;
    });
    setAnalysis(null);
    setCaptions(null);
    setPhotoDump(null);
  }, []);

  const updateSettings = useCallback((partial: Partial<GenerationSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const analyze = useCallback(async () => {
    if (images.length === 0) return;
    setIsAnalyzing(true);
    try {
      const firstImage = images[0].compressed || images[0].preview;
      const colors = await extractDominantColors(firstImage);
      const dataUrls = images.map((img) => img.compressed || img.preview);
      const result = await analyzeImages(dataUrls, colors);
      setAnalysis(result);

      if (images.length > 1) {
        const dump = await generatePhotoDump(result, images.length);
        setPhotoDump(dump);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [images]);

  const generate = useCallback(async () => {
    if (!analysis) return;
    setIsGenerating(true);
    try {
      const result = await generateCaptions(analysis, settings);
      setCaptions(result);
    } finally {
      setIsGenerating(false);
    }
  }, [analysis, settings]);

  const regenerateCaption = useCallback(
    async (length: CaptionLength, index: number) => {
      if (!analysis || !captions) return;
      setIsGenerating(true);
      try {
        const existing = [
          ...captions.short.map((c) => c.text),
          ...captions.medium.map((c) => c.text),
          ...captions.long.map((c) => c.text),
        ];
        const newText = await regenerateSingleCaption(
          analysis,
          settings,
          length,
          index,
          existing
        );
        setCaptions((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          updated[length] = prev[length].map((c, i) =>
            i === index ? { ...c, text: newText } : c
          );
          return updated;
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [analysis, captions, settings]
  );

  const reset = useCallback(() => {
    revokeImagePreview(images);
    setImagesState([]);
    setAnalysis(null);
    setCaptions(null);
    setPhotoDump(null);
    setSettings(defaultSettings);
  }, [images]);

  return (
    <CaptionlyContext.Provider
      value={{
        images,
        setImages,
        analysis,
        captions,
        photoDump,
        isAnalyzing,
        isGenerating,
        settings,
        updateSettings,
        analyze,
        generate,
        regenerateCaption,
        reset,
      }}
    >
      {children}
    </CaptionlyContext.Provider>
  );
}

export function useCaptionly() {
  const ctx = useContext(CaptionlyContext);
  if (!ctx) throw new Error("useCaptionly must be used within CaptionlyProvider");
  return ctx;
}

export type {
  CaptionStyle,
  Tone,
  EmojiLevel,
  Capitalization,
  Platform,
};
