"use client";

import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImagePlus } from "lucide-react";
import { useCaptionly } from "@/context/captionly-context";
import { createUploadedImage, validateImageFile } from "@/lib/image";
import { MAX_IMAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ImageUploader() {
  const { images, setImages } = useCaptionly();
  const inputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = MAX_IMAGES - images.length;

      if (remaining <= 0) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
        return;
      }

      const toAdd = fileArray.slice(0, remaining);
      const newImages = [...images];

      for (const file of toAdd) {
        const error = validateImageFile(file);
        if (error) {
          toast.error(error);
          continue;
        }
        try {
          const uploaded = await createUploadedImage(file);
          newImages.push(uploaded);
        } catch {
          toast.error(`Failed to process ${file.name}`);
        }
      }

      setImages(newImages);
    },
    [images, setImages]
  );

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    isDragging.current = false;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          isDragging.current = true;
        }}
        onDragLeave={() => {
          isDragging.current = false;
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-3xl border-2 border-dashed border-rose-200/60 bg-white/40 backdrop-blur-xl p-8 sm:p-12 transition-all hover:border-rose-300 hover:bg-white/60 hover:shadow-xl hover:shadow-rose-100/50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-violet-100 shadow-inner">
            <Upload className="h-7 w-7 text-rose-500" />
          </div>
          <div>
            <p className="text-lg font-medium">Drop your photos here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload 1–{MAX_IMAGES} images · JPG, PNG, WEBP · Max 10MB each
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl gap-2 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <ImagePlus className="h-4 w-4" />
            Choose Photos
          </Button>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg shadow-black/5"
              >
                <img
                  src={img.preview}
                  alt={`Upload ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="absolute bottom-2 left-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {i + 1}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
