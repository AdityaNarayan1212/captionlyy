"use client";

import { motion } from "framer-motion";
import { Images, Copy } from "lucide-react";
import { useCaptionly } from "@/context/captionly-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PhotoDump() {
  const { photoDump, images } = useCaptionly();

  if (!photoDump || images.length <= 1) return null;

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl glass p-5 sm:p-6 space-y-5"
    >
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Images className="h-4 w-4 text-indigo-500" />
        Photo Dump
      </h3>

      <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-violet-50 p-5 text-center">
        <p className="text-xs text-muted-foreground mb-1">Dump Title</p>
        <p className="text-xl font-semibold">{photoDump.title}</p>
        <Button
          variant="ghost"
          size="xs"
          className="mt-2 rounded-lg gap-1"
          onClick={() => copyText(photoDump.title)}
        >
          <Copy className="h-3 w-3" /> Copy
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Dump Captions
        </p>
        {photoDump.captions.map((caption, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-3 rounded-2xl bg-white/60 p-3"
          >
            <p className="text-sm flex-1">{caption}</p>
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0 rounded-lg"
              onClick={() => copyText(caption)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Album Names</p>
        <div className="flex flex-wrap gap-2">
          {photoDump.albumNames.map((name, i) => (
            <button
              key={i}
              onClick={() => copyText(name)}
              className="rounded-full bg-white/60 px-4 py-2 text-sm hover:bg-white/80 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
