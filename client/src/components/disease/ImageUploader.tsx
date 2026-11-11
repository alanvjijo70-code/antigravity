import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ImageUploaderProps {
  onImageSelected: (file: File | null) => void;
  selectedFile: File | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  selectedFile,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please select a compressed plant photo.');
      return;
    }

    // Validate mime type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid file format. Please upload JPG, PNG, or WebP.');
      return;
    }

    setError(null);
    onImageSelected(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onImageSelected(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 group max-h-72 flex items-center justify-center">
          <img
            src={preview}
            alt="Selected Plant Foliage"
            className="w-full h-full object-contain max-h-72"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition shadow-md"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
            {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(0)} KB)
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition group bg-slate-50/50"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            {t('disease.uploadPrompt')}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {t('disease.supportedFormats')}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-3.5 py-1.5 rounded-xl">
            <Camera className="w-4 h-4" />
            <span>Take Camera Photo or Browse</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
