import type {
  PhotoAnalysis,
  CaptionSet,
  GenerationSettings,
  PhotoDumpContent,
  CaptionStyle,
} from "../types";
import { getMoodLabel } from "../constants";
import { v4 as uuidv4 } from "uuid";

const VIBE_POOLS = [
  { label: "Coastal Healing", energy: "Main Character Energy" },
  { label: "Chaotic Fun", energy: "Unbothered Energy" },
  { label: "Cozy Aesthetic", energy: "Soft Girl Energy" },
  { label: "Adventurous Spirit", energy: "Wanderlust Energy" },
  { label: "Peaceful Zen", energy: "Spiritual Energy" },
  { label: "Disciplined Focus", energy: "Sigma Energy" },
  { label: "Proud Moments", energy: "Main Character Energy" },
  { label: "Carefree Days", energy: "Free Spirit Energy" },
];

const STYLE_TEMPLATES: Record<CaptionStyle, { short: string[]; medium: string[]; long: string[] }> = {
  "Gen Z": {
    short: ["no thoughts just vibes", "rent free era", "ate and left", "core memory unlocked", "delulu is the solulu"],
    medium: ["living in my delulu era and honestly it's serving", "the plot twist is there is no plot just vibes", "this is your sign to be unhinged responsibly today"],
    long: ["no thoughts head empty just existing in my main character arc where the soundtrack is always perfect and the lighting is always golden hour energy"],
  },
  Cool: {
    short: ["effortless.", "mood.", "no caption needed.", "just vibing.", "stay cool."],
    medium: ["too cool for a long caption but here we are anyway", "effortlessly iconic and intentionally unbothered"],
    long: ["some moments don't need explanation they just need to exist in the feed like art in a gallery quiet powerful and completely unbothered by your opinion"],
  },
  Aesthetic: {
    short: ["soft light soft life", "golden hour girl", "aesthetic hours", "dreamy vibes", "pinterest worthy"],
    medium: ["wrapped in golden light and softer thoughts than usual", "the kind of moment that belongs on a mood board forever"],
    long: ["there's something about the way the light falls and the colors blend that makes this feel like a scene from a film you never want to end"],
  },
  Cinematic: {
    short: ["scene one.", "fade in.", "final cut.", "widescreen.", "director's cut."],
    medium: ["every frame a still from the movie of my life", "cinematography by the universe lighting by golden hour"],
    long: ["if this were a film it would open with a slow pan across the scene the score swelling as the protagonist realizes this is the moment everything changes"],
  },
  Poetic: {
    short: ["bloom where planted", "light finds you", "breathe the beauty", "soul speaks", "quiet wonder"],
    medium: ["the sky wrote poetry today and i was lucky enough to read it", "some moments whisper what words can only dream of saying"],
    long: ["in the space between heartbeats the world reveals its quiet poetry and we are blessed to witness it if only for a fleeting golden moment"],
  },
  "Main Character": {
    short: ["plot armor on", "main character", "center stage", "my era", "protagonist vibes"],
    medium: ["the main character energy is absolutely unmatched today", "supporting characters could never understand this level of protagonist"],
    long: ["every great story needs a protagonist who knows they're the main character and today that protagonist is me walking through life like it's my personal montage"],
  },
  Nonchalant: {
    short: ["oh this? casual.", "whatever.", "didn't even try.", "casual flex.", "no big deal."],
    medium: ["just casually having the best time of my life no big deal really", "accidentally looked this good today sorry not sorry"],
    long: ["some people try really hard to look effortless i just wake up like this and honestly it's exhausting being this naturally iconic but someone has to do it"],
  },
  Funny: {
    short: ["help i'm iconic", "send help (or snacks)", "chaos but cute", "unhinged but legal", "certified goofball"],
    medium: ["my therapist said i need to live in the moment so here i am living chaotically", "not to be dramatic but this might be my villain origin story"],
    long: ["if you need me i'll be here doing whatever this is looking like i know what i'm doing while absolutely not knowing what i'm doing but making it fashion"],
  },
  Chaotic: {
    short: ["UNHINGED", "chaos mode: ON", "no rules today", "feral but free", "beautiful disaster"],
    medium: ["operating at maximum chaos levels and the vibes have never been better", "professionally unhinged amateurly iconic"],
    long: ["the chaos is not a bug it's a feature and today i am running the most beautifully unhinged software update of my entire existence welcome to the new version"],
  },
  Romantic: {
    short: ["heart full", "love this view", "swooning", "enchanted", "butterflies"],
    medium: ["falling in love with moments like this all over again", "the kind of beauty that makes your heart skip a beat"],
    long: ["there are moments so beautiful they feel like love letters written by the universe and today i received one in the form of golden light and perfect company"],
  },
  "Soft Girl": {
    short: ["soft hours", "gentle soul", "pink energy", "cozy core", "tender vibes"],
    medium: ["wrapped in softness and surrounded by the gentlest energy", "soft girl autumn but make it eternal and slightly magical"],
    long: ["there's a softness to this moment that wraps around you like your favorite blanket on the coldest day gentle warm and impossibly comforting"],
  },
  "Clean Girl": {
    short: ["clean energy", "minimal magic", "effortless glow", "polished.", "refined."],
    medium: ["clean girl energy with a side of main character confidence", "minimal effort maximum impact the clean girl way"],
    long: ["the clean girl aesthetic isn't about perfection it's about intention every detail curated every moment purposeful every vibe effortlessly polished"],
  },
  "Travel Blogger": {
    short: ["wanderlust", "passport ready", "new horizon", "jet set", "explore more"],
    medium: ["collecting stamps and stories one adventure at a time", "the world is wide and my passport is ready for chapter next"],
    long: ["there's a map spread across my heart with pins in every place that's changed me and today i'm adding another coordinate to the collection of who i'm becoming"],
  },
  Minimalist: {
    short: [".", "less.", "here.", "now.", "simple."],
    medium: ["less noise more presence", "the art of saying everything with almost nothing"],
    long: ["in a world that screams the most radical act is whispering and today i choose the quiet power of presence over the noise of explanation"],
  },
  Shakespearian: {
    short: ["what light through yonder breaks", "to post or not to post", "fair fortune smiles", "hark this beauty", "forsooth iconic"],
    medium: ["what light through yonder window breaks tis this scene and i the fortunate witness", "shall i compare thee to a summer's day thou art more lovely"],
    long: ["o what a rogue and peasant slave am i to think that heaven itself doth paint such scenes for mortal eyes yet here i stand blessed by fortune's fairest hand"],
  },
  "Dark Academia": {
    short: ["memento mori", "carpe noctem", "obscura", "antique soul", "gothic hour"],
    medium: ["lost in the library of golden moments and antique dreams", "dark academia hours in a world too bright for ordinary souls"],
    long: ["there is a melancholy beauty in moments that feel borrowed from another century as if time itself paused to let us exist in this gothic reverie of light and shadow"],
  },
  Spiritual: {
    short: ["aligned.", "grateful.", "blessed.", "sacred.", "universe speaks"],
    medium: ["the universe conspired to bring me to this exact moment", "aligned with something bigger than i can explain"],
    long: ["when you pause long enough to feel it there's a sacredness in ordinary moments a whisper from something infinite reminding you that you are exactly where you need to be"],
  },
  Sigma: {
    short: ["lone wolf.", "unbothered.", "grind.", "focus.", "built different."],
    medium: ["sigma energy: improving in silence while they talk", "the grind doesn't stop the distractions do"],
    long: ["while others seek validation the sigma walks alone forging a path that needs no audience no applause just the quiet satisfaction of knowing excellence requires no witnesses"],
  },
  Pinterest: {
    short: ["mood board material", "pin this energy", "vision board", "that girl era", "manifested this"],
    medium: ["the pinterest girlies could never recreate this exact energy", "saved to the vision board of my best life"],
    long: ["this is the kind of moment you pin to your vision board and manifest for years until one day you wake up and realize you're living inside the mood board you created"],
  },
};

function applyCapitalization(text: string, cap: GenerationSettings["capitalization"]): string {
  if (cap === "all lowercase") return text.toLowerCase();
  if (cap === "dramatic") return text.toUpperCase();
  return text;
}

function applyEmoji(text: string, level: GenerationSettings["emojiLevel"]): string {
  const emojiSets = {
    none: [""],
    low: [" ✨", " 🌿", ""],
    medium: [" ✨", " 🌊", " 💫", " 🌸"],
    high: [" ✨🔥", " 🌊💫", " 🌸✨", " 💕🦋", " 🌅✨"],
  };
  const set = emojiSets[level];
  if (level === "none") return text;
  const suffix = set[Math.floor(Math.random() * set.length)];
  return text + suffix;
}

function varyCaption(
  base: string,
  analysis: PhotoAnalysis,
  settings: GenerationSettings,
  index: number
): string {
  const mood = getMoodLabel(settings.mood);
  const keyword = analysis.keywords[index % analysis.keywords.length] || "vibes";
  let text = base;

  if (index % 3 === 0) {
    text = `${text} // ${keyword}`;
  } else if (index % 3 === 1) {
    text = `${mood} energy: ${text}`;
  }

  text = applyCapitalization(text, settings.capitalization);
  text = applyEmoji(text, settings.emojiLevel);
  return text;
}

export function generateMockAnalysis(
  colors: string[],
  imageCount: number
): PhotoAnalysis {
  const vibe = VIBE_POOLS[Math.floor(Math.random() * VIBE_POOLS.length)];
  const score = 65 + Math.floor(Math.random() * 30);
  const mcPercent = 70 + Math.floor(Math.random() * 25);

  const keywordsPool = [
    ["sunset", "beach", "travel", "peace"],
    ["night", "friends", "fun", "energy"],
    ["coffee", "cozy", "aesthetic", "warm"],
    ["mountains", "adventure", "nature", "wild"],
    ["city", "lights", "urban", "vibes"],
  ];

  const hours = ["6:30 AM", "12:00 PM", "5:45 PM", "7:30 PM", "9:15 PM"];

  return {
    scenery: imageCount > 1 ? "A curated collection of meaningful moments" : "Beautiful scenery with striking visual composition",
    people: "Friends or solo subject radiating confidence",
    colors: colors.length > 0 ? colors : ["#E8D5B7", "#7BA7BC", "#2C3E50", "#F5E6D3", "#A8C5DA"],
    mood: vibe.label.toLowerCase(),
    lighting: "Golden hour with soft natural warmth",
    locationType: imageCount > 1 ? "Mixed locations" : "Scenic outdoor setting",
    outfitAesthetics: "Effortlessly stylish with main character energy",
    activity: imageCount > 1 ? "Capturing life's best moments" : "Living in the moment",
    season: "Summer",
    timeOfDay: "Golden hour",
    overallVibe: vibe.label,
    vibeScore: score,
    vibeLabel: vibe.label,
    energyLabel: vibe.energy,
    vibeStatement: `You are giving: ${vibe.label} + ${vibe.energy}.`,
    keywords: keywordsPool[Math.floor(Math.random() * keywordsPool.length)],
    bestPostingTime: hours[Math.floor(Math.random() * hours.length)],
    mainCharacterPercent: mcPercent,
  };
}

export function generateMockCaptions(
  analysis: PhotoAnalysis,
  settings: GenerationSettings
): CaptionSet {
  const templates = STYLE_TEMPLATES[settings.style];

  const makeSet = (bases: string[], length: "short" | "medium" | "long") =>
    bases.map((base, i) => ({
      id: uuidv4(),
      text: varyCaption(base, analysis, settings, i),
      length,
      style: settings.style,
    }));

  return {
    short: makeSet(templates.short, "short"),
    medium: makeSet(
      templates.medium.length >= 5
        ? templates.medium
        : [...templates.medium, ...templates.short].slice(0, 5),
      "medium"
    ),
    long: makeSet(
      templates.long.length >= 5
        ? templates.long
        : [...templates.long, ...templates.medium].slice(0, 5),
      "long"
    ),
  };
}

export function generateMockDump(
  analysis: PhotoAnalysis,
  imageCount: number
): PhotoDumpContent {
  const titles = [
    "june but saltier 🌊",
    "random moments that felt important",
    "western edge of india",
    "core memories only no context",
    "a very specific era",
    "photo dump because therapy is expensive",
  ];

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    captions: [
      `a ${imageCount}-part story about ${analysis.keywords[0]} and ${analysis.keywords[1]}`,
      `not a highlight reel just real ${analysis.overallVibe.toLowerCase()} moments`,
      `the vibes were ${analysis.mood} and the camera was ready`,
    ],
    albumNames: [
      `${analysis.keywords[0]} chronicles`,
      `moments in ${analysis.locationType.toLowerCase()}`,
      `${analysis.season} but make it aesthetic`,
    ],
  };
}
