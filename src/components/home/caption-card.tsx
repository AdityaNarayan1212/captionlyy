"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Heart, RefreshCw, Check } from "lucide-react";
import type { Caption } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { addFavorite, isFavorite, removeFavorite } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CaptionCardProps {
  caption: Caption;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function CaptionCard({
  caption,
  onRegenerate,
  isRegenerating,
}: CaptionCardProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(() => isFavorite(caption.id));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption.text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (saved) {
      removeFavorite(caption.id);
      setSaved(false);
      toast.info("Removed from favorites");
    } else {
      addFavorite({
        id: caption.id || uuidv4(),
        text: caption.text,
        style: caption.style,
        folderId: null,
        savedAt: new Date().toISOString(),
      });
      setSaved(true);
      toast.success("Saved to favorites!");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl bg-white/60 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow border border-white/80"
    >
      <p className="text-sm leading-relaxed mb-3">{caption.text}</p>
      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="xs"
          className="rounded-lg gap-1"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          Copy
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className={cn("rounded-lg gap-1", saved && "text-rose-500")}
          onClick={handleSave}
        >
          <Heart className={cn("h-3.5 w-3.5", saved && "fill-current")} />
          {saved ? "Saved" : "Save"}
        </Button>
        <Button
          variant="ghost"
          size="xs"
          className="rounded-lg gap-1"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", isRegenerating && "animate-spin")}
          />
          Regenerate
        </Button>
      </div>
    </motion.div>
  );
}
