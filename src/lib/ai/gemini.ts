import type {
  PhotoAnalysis,
  CaptionSet,
  Caption,
  CaptionStyle,
  CaptionLength,
  GenerationSettings,
  PhotoDumpContent,
} from "../types";
import { getApiKey } from "../storage";
import { v4 as uuidv4 } from "uuid";
import { generateMockAnalysis, generateMockCaptions, generateMockDump } from "./mock";

const GEMINI_MODEL = "gemini-2.0-flash";

async function callGemini(
  apiKey: string,
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI request failed: ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function parseJsonFromResponse<T>(text: string): T {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
  return JSON.parse(jsonStr) as T;
}

function base64FromDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const [header, data] = dataUrl.split(",");
  const mimeType = header.match(/data:(.*?);/)?.[1] || "image/jpeg";
  return { mimeType, data };
}

export async function analyzeImages(
  imageDataUrls: string[],
  extractedColors: string[]
): Promise<PhotoAnalysis> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return generateMockAnalysis(extractedColors, imageDataUrls.length);
  }

  const imageParts = imageDataUrls.slice(0, 3).map((url) => ({
    inlineData: base64FromDataUrl(url),
  }));

  const prompt = `Analyze these ${imageDataUrls.length} photo(s) for a social media caption app. Return ONLY valid JSON with this exact structure:
{
  "scenery": "description",
  "people": "description of people if any",
  "colors": ["color1", "color2", "color3", "color4", "color5"],
  "mood": "emotional mood",
  "lighting": "lighting description",
  "locationType": "type of location",
  "outfitAesthetics": "fashion/aesthetic description",
  "activity": "what's happening",
  "season": "season",
  "timeOfDay": "time of day",
  "overallVibe": "2-3 word vibe",
  "vibeScore": 85,
  "vibeLabel": "e.g. Coastal Healing",
  "energyLabel": "e.g. Main Character Energy",
  "vibeStatement": "You are giving: [vibe] + [energy].",
  "keywords": ["word1", "word2", "word3", "word4"],
  "bestPostingTime": "e.g. 7:30 PM",
  "mainCharacterPercent": 87
}

Be creative and specific. vibeScore is 0-100. mainCharacterPercent is 0-100.`;

  try {
    const text = await callGemini(apiKey, [{ text: prompt }, ...imageParts]);
    const parsed = parseJsonFromResponse<PhotoAnalysis>(text);
    if (extractedColors.length > 0) {
      parsed.colors = extractedColors;
    }
    return parsed;
  } catch {
    return generateMockAnalysis(extractedColors, imageDataUrls.length);
  }
}

export async function generateCaptions(
  analysis: PhotoAnalysis,
  settings: GenerationSettings
): Promise<CaptionSet> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return generateMockCaptions(analysis, settings);
  }

  const prompt = `Generate social media captions based on this photo analysis:
${JSON.stringify(analysis, null, 2)}

Settings:
- Style: ${settings.style}
- Mood slider (0=calm, 100=chaotic): ${settings.mood}
- Tone: ${settings.tone}
- Emoji level: ${settings.emojiLevel}
- Capitalization: ${settings.capitalization}
- Platform: ${settings.platform}

Return ONLY valid JSON:
{
  "short": ["caption1", "caption2", "caption3", "caption4", "caption5"],
  "medium": ["caption1", "caption2", "caption3", "caption4", "caption5"],
  "long": ["caption1", "caption2", "caption3", "caption4", "caption5"]
}

Short = under 50 chars. Medium = 50-120 chars. Long = 120-220 chars.
Match the ${settings.style} style perfectly. Apply ${settings.tone} tone.
Emoji: ${settings.emojiLevel}. Capitalization: ${settings.capitalization}.
Optimize for ${settings.platform}.`;

  try {
    const text = await callGemini(apiKey, [{ text: prompt }]);
    const parsed = parseJsonFromResponse<{
      short: string[];
      medium: string[];
      long: string[];
    }>(text);

    return toCaptionSet(parsed, settings.style);
  } catch {
    return generateMockCaptions(analysis, settings);
  }
}

export async function regenerateSingleCaption(
  analysis: PhotoAnalysis,
  settings: GenerationSettings,
  length: CaptionLength,
  index: number,
  existingCaptions: string[]
): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    const mock = generateMockCaptions(analysis, settings);
    const pool = mock[length];
    return pool[index % pool.length]?.text ?? pool[0].text;
  }

  const lengthGuide = {
    short: "under 50 characters",
    medium: "50-120 characters",
    long: "120-220 characters",
  };

  const prompt = `Generate ONE new ${length} caption (${lengthGuide[length]}) for this photo.
Analysis: ${JSON.stringify(analysis)}
Style: ${settings.style}, Mood: ${settings.mood}, Tone: ${settings.tone}
Emoji: ${settings.emojiLevel}, Caps: ${settings.capitalization}, Platform: ${settings.platform}
Avoid these existing captions: ${existingCaptions.join(" | ")}
Return ONLY the caption text, nothing else.`;

  try {
    const text = await callGemini(apiKey, [{ text: prompt }]);
    return text.trim().replace(/^["']|["']$/g, "");
  } catch {
    const mock = generateMockCaptions(analysis, settings);
    return mock[length][index % 5]?.text ?? "vibes only no caption needed";
  }
}

export async function generatePhotoDump(
  analysis: PhotoAnalysis,
  imageCount: number
): Promise<PhotoDumpContent> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return generateMockDump(analysis, imageCount);
  }

  const prompt = `Create photo dump content for ${imageCount} images.
Analysis: ${JSON.stringify(analysis)}
Return ONLY valid JSON:
{
  "title": "creative dump title like 'june but saltier 🌊'",
  "captions": ["dump caption 1", "dump caption 2", "dump caption 3"],
  "albumNames": ["album name 1", "album name 2", "album name 3"]
}`;

  try {
    const text = await callGemini(apiKey, [{ text: prompt }]);
    return parseJsonFromResponse<PhotoDumpContent>(text);
  } catch {
    return generateMockDump(analysis, imageCount);
  }
}

function toCaptionSet(
  parsed: { short: string[]; medium: string[]; long: string[] },
  style: CaptionStyle
): CaptionSet {
  const makeCaptions = (texts: string[], length: CaptionLength): Caption[] =>
    texts.slice(0, 5).map((text) => ({
      id: uuidv4(),
      text,
      length,
      style,
    }));

  return {
    short: makeCaptions(parsed.short || [], "short"),
    medium: makeCaptions(parsed.medium || [], "medium"),
    long: makeCaptions(parsed.long || [], "long"),
  };
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}
