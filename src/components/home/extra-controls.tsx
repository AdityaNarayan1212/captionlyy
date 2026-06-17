"use client";

import { useCaptionly } from "@/context/captionly-context";
import {
  TONES,
  EMOJI_LEVELS,
  CAPITALIZATIONS,
  PLATFORMS,
  CAPTION_STYLES,
} from "@/lib/constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CaptionStyle } from "@/lib/types";

export function ExtraControls() {
  const { settings, updateSettings } = useCaptionly();

  return (
    <div className="rounded-3xl glass p-5 space-y-5">
      <h3 className="font-semibold">Caption Controls</h3>

      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">Caption Style</Label>
        <div className="flex flex-wrap gap-1.5">
          {CAPTION_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => updateSettings({ style: style as CaptionStyle })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                settings.style === style
                  ? "bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-md shadow-rose-200/50"
                  : "bg-white/60 hover:bg-white/80 text-foreground"
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ControlSelect
          label="Tone"
          value={settings.tone}
          options={TONES}
          onChange={(v) => updateSettings({ tone: v as typeof settings.tone })}
        />
        <ControlSelect
          label="Emoji Level"
          value={settings.emojiLevel}
          options={EMOJI_LEVELS}
          onChange={(v) =>
            updateSettings({ emojiLevel: v as typeof settings.emojiLevel })
          }
        />
        <ControlSelect
          label="Capitalization"
          value={settings.capitalization}
          options={CAPITALIZATIONS}
          onChange={(v) =>
            updateSettings({
              capitalization: v as typeof settings.capitalization,
            })
          }
        />
        <ControlSelect
          label="Platform"
          value={settings.platform}
          options={PLATFORMS}
          onChange={(v) =>
            updateSettings({ platform: v as typeof settings.platform })
          }
        />
      </div>
    </div>
  );
}

function ControlSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={value}
        onValueChange={(v) => v && onChange(v)}
      >
        <SelectTrigger className="rounded-xl w-full capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="capitalize rounded-lg">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
