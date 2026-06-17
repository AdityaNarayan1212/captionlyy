import type {
  CaptionStyle,
  Tone,
  EmojiLevel,
  Capitalization,
  Platform,
  ExploreCategory,
} from "./types";

export const CAPTION_STYLES: CaptionStyle[] = [
  "Gen Z",
  "Cool",
  "Aesthetic",
  "Cinematic",
  "Poetic",
  "Main Character",
  "Nonchalant",
  "Funny",
  "Chaotic",
  "Romantic",
  "Soft Girl",
  "Clean Girl",
  "Travel Blogger",
  "Minimalist",
  "Shakespearian",
  "Dark Academia",
  "Spiritual",
  "Sigma",
  "Pinterest",
];

export const TONES: Tone[] = [
  "mysterious",
  "funny",
  "confident",
  "soft",
  "elegant",
  "savage",
  "wholesome",
  "emotional",
];

export const EMOJI_LEVELS: EmojiLevel[] = ["none", "low", "medium", "high"];

export const CAPITALIZATIONS: Capitalization[] = [
  "all lowercase",
  "normal",
  "dramatic",
];

export const PLATFORMS: Platform[] = [
  "Instagram",
  "Instagram dump",
  "Instagram story",
  "Snapchat",
  "WhatsApp status",
  "Twitter/X",
  "Threads",
  "LinkedIn",
  "Pinterest",
];

export const MAX_IMAGES = 10;
export const MAX_FILE_SIZE_MB = 10;
export const COMPRESSION_MAX_SIZE_MB = 1;

export const MOOD_LABELS: Record<number, string> = {
  0: "calm",
  25: "aesthetic",
  50: "cool",
  75: "energetic",
  100: "chaotic",
};

export function getMoodLabel(mood: number): string {
  if (mood <= 12) return "calm";
  if (mood <= 37) return "aesthetic";
  if (mood <= 62) return "cool";
  if (mood <= 87) return "energetic";
  return "chaotic";
}

export const DEFAULT_FOLDERS = [
  { name: "Beach", emoji: "🏖️" },
  { name: "Travel", emoji: "✈️" },
  { name: "College", emoji: "🎓" },
  { name: "Friends", emoji: "👯" },
];

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    id: "viral-genz",
    emoji: "🔥",
    name: "Viral Gen Z",
    captions: [
      "no thoughts just vibes and questionable decisions",
      "rent free in everyone's head apparently",
      "the plot twist is that there is no plot",
      "living in my delulu era and it's serving",
      "core memory unlocked no refunds",
      "ate and left no crumbs (emotionally)",
      "this is your sign to be unhinged today",
      "main character syndrome but make it aesthetic",
    ],
  },
  {
    id: "beach",
    emoji: "🌊",
    name: "Beach",
    captions: [
      "salt in my hair peace in my soul",
      "tides change but this feeling stays",
      "golden hour hits different by the water",
      "where the wifi is weak and the vibes are strong",
      "seas the day",
      "ocean therapy session complete",
      "sandy toes sun-kissed nose",
      "blue mind activated",
    ],
  },
  {
    id: "travel",
    emoji: "✈️",
    name: "Travel",
    captions: [
      "collecting passport stamps and core memories",
      "not all who wander are lost some are just vibing",
      "adventure is out there and so am i",
      "new city same me different energy",
      "wander often wonder always",
      "lost in the right direction",
      "the world is big and i am ready",
      "jet lag is just time zone poetry",
    ],
  },
  {
    id: "cafe",
    emoji: "☕",
    name: "Cafe",
    captions: [
      "coffee first everything else later",
      "espresso yourself",
      "cafe hopping is my cardio",
      "latte art and late night thoughts",
      "warm mug cold world",
      "aesthetic hours at the corner table",
      "caffeine and contemplation",
      "this latte understood the assignment",
    ],
  },
  {
    id: "college",
    emoji: "🎓",
    name: "College",
    captions: [
      "degree loading please do not turn off",
      "surviving on ramen and ambition",
      "library hours hit different at 2am",
      "college: where sleep is optional vibes are not",
      "finals week but make it fashion",
      "educated and slightly unhinged",
      "campus walks and existential talks",
      "graduated from chaos university",
    ],
  },
  {
    id: "night",
    emoji: "🌙",
    name: "Night",
    captions: [
      "city lights and late night rights",
      "after dark the real magic begins",
      "moonlit and unbothered",
      "night owl energy activated",
      "stars can't shine without darkness",
      "midnight thoughts hit different",
      "neon dreams and quiet schemes",
      "the night is young and so are we",
    ],
  },
  {
    id: "mountains",
    emoji: "🏔️",
    name: "Mountains",
    captions: [
      "closer to the clouds further from the noise",
      "peak experiences only",
      "mountains are calling and i must go",
      "breathtaking in every sense",
      "elevation changes perspective",
      "above the clouds everything makes sense",
      "summit vibes and thin air clarity",
      "nature's cathedral",
    ],
  },
  {
    id: "gym",
    emoji: "💪",
    name: "Gym",
    captions: [
      "no pain no gain no excuses",
      "discipline over motivation always",
      "sweat now shine later",
      "becoming the best version daily",
      "gym is my therapy session",
      "stronger than yesterday",
      "reps for respect",
      "mind over muscle",
    ],
  },
  {
    id: "friends",
    emoji: "👯",
    name: "Friends",
    captions: [
      "squad goals and soul goals",
      "friends who vibe together stay together",
      "chaos crew reporting for duty",
      "these people make everything better",
      "friendship is the real flex",
      "core group core memories",
      "laughing until our stomachs hurt",
      "found my people found my peace",
    ],
  },
  {
    id: "road-trip",
    emoji: "🚗",
    name: "Road Trip",
    captions: [
      "windows down music up worries off",
      "the journey is the destination",
      "mile markers and memory makers",
      "road trip therapy in session",
      "adventure awaits down every highway",
      "tank full playlist louder",
      "getting lost on purpose",
      "open road open heart",
    ],
  },
];
