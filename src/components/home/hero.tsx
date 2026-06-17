"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="text-center space-y-6 pt-8 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-muted-foreground"
      >
        <Sparkles className="h-3.5 w-3.5 text-rose-400" />
        AI-powered social media companion
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]"
      >
        Upload photos.{" "}
        <span className="gradient-text">Match the vibe.</span>
        <br />
        Post like a main character.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-muted-foreground max-w-xl mx-auto"
      >
        Drop your pics, get Spotify Wrapped-level insights, and captions that
        actually sound like you.
      </motion.p>
    </section>
  );
}
