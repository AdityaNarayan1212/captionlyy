import imageCompression from "browser-image-compression";
import { COMPRESSION_MAX_SIZE_MB, MAX_FILE_SIZE_MB } from "./constants";
import type { UploadedImage } from "./types";
import { v4 as uuidv4 } from "uuid";

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please upload image files only.";
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Image must be under ${MAX_FILE_SIZE_MB}MB.`;
  }
  return null;
}

export async function compressImage(file: File): Promise<string> {
  const options = {
    maxSizeMB: COMPRESSION_MAX_SIZE_MB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/jpeg" as const,
  };

  try {
    const compressed = await imageCompression(file, options);
    return await fileToBase64(compressed);
  } catch {
    return await fileToBase64(file);
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function createUploadedImage(file: File): Promise<UploadedImage> {
  const preview = URL.createObjectURL(file);
  const compressed = await compressImage(file);
  return {
    id: uuidv4(),
    file,
    preview,
    compressed,
  };
}

export async function extractDominantColors(
  imageSrc: string,
  count = 5
): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(["#E8D5B7", "#7BA7BC", "#2C3E50", "#F5E6D3", "#A8C5DA"]);
        return;
      }

      const size = 50;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      const colorMap = new Map<string, number>();
      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      const sorted = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([color]) => color);

      resolve(sorted.length > 0 ? sorted : ["#E8D5B7", "#7BA7BC", "#2C3E50"]);
    };
    img.onerror = () =>
      resolve(["#E8D5B7", "#7BA7BC", "#2C3E50", "#F5E6D3", "#A8C5DA"]);
    img.src = imageSrc;
  });
}

export function revokeImagePreview(images: UploadedImage[]): void {
  images.forEach((img) => URL.revokeObjectURL(img.preview));
}
