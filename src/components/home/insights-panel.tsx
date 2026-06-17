"use client";

import { motion } from "framer-motion";
import { Clock, Palette, Hash, Zap, Star } from "lucide-react";
import { useCaptionly } from "@/context/captionly-context";
import { Badge } from "@/components/ui/badge";

export function InsightsPanel() {
  const { analysis } = useCaptionly();

  if (!analysis) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-3xl glass p-5 space-y-5 sticky top-28"
    >
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Zap className="h-4 w-4 text-amber-500" />
        AI Insights
      </h3>

      <div className="space-y-4">
        <InsightRow
          icon={Star}
          label="Photo Mood"
          value={`${analysis.mainCharacterPercent}% Main Character`}
        />
        <InsightRow
          icon={Zap}
          label="Photo Energy"
          value={analysis.energyLabel}
        />
        <InsightRow
          icon={Clock}
          label="Best Posting Time"
          value={analysis.bestPostingTime}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />
            Color Palette
          </div>
          <div className="flex gap-2">
            {analysis.colors.map((color, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-xl shadow-sm ring-1 ring-black/5 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="h-3.5 w-3.5" />
            Keywords
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.keywords.map((kw) => (
              <Badge
                key={kw}
                variant="secondary"
                className="rounded-full text-xs"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function InsightRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/50 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
