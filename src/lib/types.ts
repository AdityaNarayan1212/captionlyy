export type CaptionStyle =
  | "Gen Z"
  | "Cool"
  | "Aesthetic"
  | "Cinematic"
  | "Poetic"
  | "Main Character"
  | "Nonchalant"
  | "Funny"
  | "Chaotic"
  | "Romantic"
  | "Soft Girl"
  | "Clean Girl"
  | "Travel Blogger"
  | "Minimalist"
  | "Shakespearian"
  | "Dark Academia"
  | "Spiritual"
  | "Sigma"
  | "Pinterest";

export type CaptionLength = "short" | "medium" | "long";

export type Tone =
  | "mysterious"
  | "funny"
  | "confident"
  | "soft"
  | "elegant"
  | "savage"
  | "wholesome"
  | "emotional";

export type EmojiLevel = "none" | "low" | "medium" | "high";

export type Capitalization = "all lowercase" | "normal" | "dramatic";

export type Platform =
  | "Instagram"
  | "Instagram dump"
  | "Instagram story"
  | "Snapchat"
  | "WhatsApp status"
  | "Twitter/X"
  | "Threads"
  | "LinkedIn"
  | "Pinterest";

export interface PhotoAnalysis {
  scenery: string;
  people: string;
  colors: string[];
  mood: string;
  lighting: string;
  locationType: string;
  outfitAesthetics: string;
  activity: string;
  season: string;
  timeOfDay: string;
  overallVibe: string;
  vibeScore: number;
  vibeLabel: string;
  energyLabel: string;
  vibeStatement: string;
  keywords: string[];
  bestPostingTime: string;
  mainCharacterPercent: number;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  compressed?: string;
}

export interface Caption {
  id: string;
  text: string;
  length: CaptionLength;
  style: CaptionStyle;
}

export interface CaptionSet {
  short: Caption[];
  medium: Caption[];
  long: Caption[];
}

export interface PhotoDumpContent {
  title: string;
  captions: string[];
  albumNames: string[];
}

export interface GenerationSettings {
  mood: number;
  tone: Tone;
  emojiLevel: EmojiLevel;
  capitalization: Capitalization;
  platform: Platform;
  style: CaptionStyle;
}

export interface SavedCaption {
  id: string;
  text: string;
  style: CaptionStyle;
  folderId: string | null;
  savedAt: string;
}

export interface FavoriteFolder {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
}

export interface ExploreCategory {
  id: string;
  emoji: string;
  name: string;
  captions: string[];
}
