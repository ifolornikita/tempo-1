import React, { useState, useRef, useCallback } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ImageUploadAreaProps {
  onImageUpload?: (file: File) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
  initialImage?: string;
}

const ImageUploadArea = ({
  onImageUpload = () => {},
  acceptedFormats = "image/jpeg, image/png, image/webp, image/gif",
  maxSizeMB = 10,
  initialImage = "",
}: ImageUploadAreaProps) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [image, setImage] = useState<string>(initialImage);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (
      !file.type.match(acceptedFormats.replace(/\s/g, "").split(",").join("|"))
    ) {
      setError(
        `Invalid file type. Please upload ${acceptedFormats.replace(/image\//g, "")}.`,
      );
      return false;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }

    setError("");
    return true;
  };

  const processFile = (file: File) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [onImageUpload],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removeImage = () => {
    setImage("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div
        className={`relative w-full h-full min-h-[400px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-gray-300"} ${image ? "bg-gray-50" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full bg-white/80 hover:bg-white"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={image}
              alt="Uploaded preview"
              className="max-w-full max-h-[350px] object-contain rounded-md"
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  Drag and drop your image here
                </h3>
                <p className="text-sm text-gray-500">
                  Supports {acceptedFormats.replace(/image\//g, "")} (Max{" "}
                  {maxSizeMB}MB)
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-px w-12 bg-gray-300"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="h-px w-12 bg-gray-300"></div>
              </div>
              <Button onClick={handleButtonClick} className="mt-2">
                <ImageIcon className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </div>
            <Input
              ref={inputRef}
              type="file"
              accept={acceptedFormats}
              onChange={handleChange}
              className="hidden"
            />
          </>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploadArea;
