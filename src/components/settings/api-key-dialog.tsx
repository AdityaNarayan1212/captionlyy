"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Key, ExternalLink } from "lucide-react";
import { getApiKey, setApiKey, clearApiKey } from "@/lib/storage";
import { toast } from "sonner";

export function ApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [hasKey, setHasKey] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      const stored = getApiKey();
      setKey(stored || "");
      setHasKey(!!stored);
    }
  };

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key.trim());
      setHasKey(true);
      toast.success("API key saved! AI vision is now enabled.");
    } else {
      clearApiKey();
      setHasKey(false);
      toast.info("Using smart demo mode without API key.");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="rounded-xl gap-1.5">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        }
      />
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            AI Settings
          </DialogTitle>
          <DialogDescription>
            Add a free Gemini API key for real image analysis. Without it,
            Captionly uses smart demo mode.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="api-key">Google Gemini API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="AIza..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Get a free API key
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1 rounded-xl">
              {hasKey ? "Update Key" : "Save Key"}
            </Button>
            {hasKey && (
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  clearApiKey();
                  setKey("");
                  setHasKey(false);
                  toast.info("API key removed. Demo mode active.");
                }}
              >
                Clear
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Your key is stored locally in your browser. Never sent to our servers.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
