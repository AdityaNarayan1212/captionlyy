"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  FolderPlus,
  Trash2,
  Copy,
  Folder,
  MoreHorizontal,
} from "lucide-react";
import {
  getFavorites,
  getFolders,
  saveFolders,
  saveFavorites,
  removeFavorite,
} from "@/lib/storage";
import type { SavedCaption, FavoriteFolder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<SavedCaption[]>([]);
  const [folders, setFolders] = useState<FavoriteFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setFolders(getFolders());
  }, []);

  const filtered = activeFolder
    ? favorites.filter((f) => f.folderId === activeFolder)
    : favorites;

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const folder: FavoriteFolder = {
      id: uuidv4(),
      name: newFolderName.trim(),
      emoji: "📁",
      createdAt: new Date().toISOString(),
    };
    const updated = [...folders, folder];
    setFolders(updated);
    saveFolders(updated);
    setNewFolderName("");
    setDialogOpen(false);
    toast.success(`Folder "${folder.name}" created!`);
  };

  const deleteFolder = (id: string) => {
    const updated = folders.filter((f) => f.id !== id);
    setFolders(updated);
    saveFolders(updated);
    const updatedFavs = favorites.map((f) =>
      f.folderId === id ? { ...f, folderId: null } : f
    );
    setFavorites(updatedFavs);
    saveFavorites(updatedFavs);
    if (activeFolder === id) setActiveFolder(null);
  };

  const moveToFolder = (captionId: string, folderId: string | null) => {
    const updated = favorites.map((f) =>
      f.id === captionId ? { ...f, folderId } : f
    );
    setFavorites(updated);
    saveFavorites(updated);
    toast.success("Moved to folder!");
  };

  const handleDelete = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
    toast.info("Removed from favorites");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Your <span className="gradient-text">Favorites</span>
        </h1>
        <p className="text-muted-foreground">
          Saved captions organized in folders. Your personal caption library.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeFolder === null ? "default" : "outline"}
          size="sm"
          className="rounded-xl gap-1.5"
          onClick={() => setActiveFolder(null)}
        >
          <Heart className="h-3.5 w-3.5" />
          All ({favorites.length})
        </Button>

        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center">
            <Button
              variant={activeFolder === folder.id ? "default" : "outline"}
              size="sm"
              className="rounded-xl gap-1.5 rounded-r-none"
              onClick={() => setActiveFolder(folder.id)}
            >
              <span>{folder.emoji}</span>
              {folder.name} (
              {favorites.filter((f) => f.folderId === folder.id).length})
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-xl rounded-l-none border-l-0"
              onClick={() => deleteFolder(folder.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                <FolderPlus className="h-3.5 w-3.5" />
                New Folder
              </Button>
            }
          />
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input
                placeholder="e.g. Beach, Travel, College..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && createFolder()}
              />
              <Button onClick={createFolder} className="w-full rounded-xl">
                Create Folder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl glass p-12 text-center"
          >
            <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">No saved captions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Save captions from the generator or Explore page
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((fav) => (
              <motion.div
                key={fav.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl glass p-4 space-y-3"
              >
                <p className="text-sm leading-relaxed">{fav.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize">
                    {fav.style}
                  </span>
                  <div className="flex items-center gap-1">
                    {folders.length > 0 && (
                      <FolderPicker
                        folders={folders}
                        currentFolderId={fav.folderId}
                        onSelect={(folderId) => moveToFolder(fav.id, folderId)}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-lg"
                      onClick={() => handleCopy(fav.text)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-lg text-destructive"
                      onClick={() => handleDelete(fav.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FolderPicker({
  folders,
  currentFolderId,
  onSelect,
}: {
  folders: FavoriteFolder[];
  currentFolderId: string | null;
  onSelect: (folderId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon-xs"
        className="rounded-lg"
        onClick={() => setOpen(!open)}
      >
        <MoreHorizontal className="h-3 w-3" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-10 rounded-xl glass p-1 min-w-[140px] shadow-lg">
          <button
            className={cn(
              "w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-white/60",
              !currentFolderId && "bg-white/60"
            )}
            onClick={() => {
              onSelect(null);
              setOpen(false);
            }}
          >
            No folder
          </button>
          {folders.map((f) => (
            <button
              key={f.id}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-white/60",
                currentFolderId === f.id && "bg-white/60"
              )}
              onClick={() => {
                onSelect(f.id);
                setOpen(false);
              }}
            >
              {f.emoji} {f.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
