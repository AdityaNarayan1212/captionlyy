import type { FavoriteFolder, SavedCaption } from "./types";
import { DEFAULT_FOLDERS } from "./constants";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEYS = {
  API_KEY: "captionly_api_key",
  FOLDERS: "captionly_folders",
  FAVORITES: "captionly_favorites",
  SETTINGS: "captionly_settings",
} as const;

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
}

export function getFolders(): FavoriteFolder[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.FOLDERS);
  if (stored) return JSON.parse(stored) as FavoriteFolder[];

  const defaults: FavoriteFolder[] = DEFAULT_FOLDERS.map((f) => ({
    id: uuidv4(),
    name: f.name,
    emoji: f.emoji,
    createdAt: new Date().toISOString(),
  }));
  localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(defaults));
  return defaults;
}

export function saveFolders(folders: FavoriteFolder[]): void {
  localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
}

export function getFavorites(): SavedCaption[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return stored ? (JSON.parse(stored) as SavedCaption[]) : [];
}

export function saveFavorites(favorites: SavedCaption[]): void {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

export function addFavorite(caption: SavedCaption): void {
  const favorites = getFavorites();
  if (!favorites.some((f) => f.id === caption.id)) {
    favorites.unshift(caption);
    saveFavorites(favorites);
  }
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  saveFavorites(favorites);
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((f) => f.id === id);
}
