"use client";

import { motion } from "framer-motion";
import { Copy, Heart } from "lucide-react";
import { EXPLORE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { addFavorite } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import type { CaptionStyle } from "@/lib/types";

export function ExplorePage() {
  const today = new Date().getDate();
  const shuffled = [...EXPLORE_CATEGORIES].sort(
    (a, b) =>
      ((today * a.name.length) % 7) - ((today * b.name.length) % 7)
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Explore <span className="gradient-text">Trending</span>
        </h1>
        <p className="text-muted-foreground">
          Daily curated captions for every vibe. Copy, save, post.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {shuffled.map((category, catIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.05 }}
            className="rounded-3xl glass p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.emoji}</span>
              <h2 className="font-semibold text-lg">{category.name}</h2>
            </div>

            <div className="space-y-2">
              {category.captions.map((caption, i) => (
                <CaptionRow key={i} caption={caption} category={category.name} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CaptionRow({
  caption,
  category,
}: {
  caption: string;
  category: string;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    toast.success("Copied!");
  };

  const handleSave = () => {
    addFavorite({
      id: uuidv4(),
      text: caption,
      style: category as CaptionStyle,
      folderId: null,
      savedAt: new Date().toISOString(),
    });
    toast.success("Saved to favorites!");
  };

  return (
    <div className="group flex items-start gap-2 rounded-2xl bg-white/50 p-3 hover:bg-white/70 transition-colors">
      <p className="text-sm flex-1 leading-relaxed">{caption}</p>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          variant="ghost"
          size="icon-xs"
          className="rounded-lg"
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="rounded-lg"
          onClick={handleSave}
        >
          <Heart className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
