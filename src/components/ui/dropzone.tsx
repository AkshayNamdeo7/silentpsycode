"use client";

import { useEffect, useMemo, useState } from "react";
import { UploadCloud, ImagePlus } from "lucide-react";

interface DropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
}

export default function Dropzone({ files, onFilesChange, error }: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const selected = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    onFilesChange([...files, ...selected].slice(0, 6));
  };

  const removeImage = (index: number) => {
    onFilesChange(files.filter((_, idx) => idx !== index));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-[2rem] border border-white/10 bg-slate-950/90 px-6 py-10 text-center transition ${
          dragActive ? "border-sky-400/50 bg-slate-900/90" : "hover:border-sky-300/30"
        }`}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-sky-300" />
        <p className="mt-4 text-lg font-semibold text-white">Drag & drop book images</p>
        <p className="mt-2 text-sm text-slate-400">Upload up to 6 images for your listing.</p>
        <label className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
          <ImagePlus className="mr-2 h-4 w-4" />
          Browse files
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => addFiles(event.target.files)}
          />
        </label>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      {previews.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {previews.map((preview, index) => (
            <div key={preview.file.name + preview.file.size + preview.file.lastModified} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/90">
              <img src={preview.url} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white transition hover:bg-rose-500/90"
              >
                <span className="sr-only">Remove image</span>
                <span className="text-base">×</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
