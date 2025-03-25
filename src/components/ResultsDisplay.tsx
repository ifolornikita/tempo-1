import React from "react";
import { Button } from "./ui/button";
import {
  Download,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  originalImage?: string;
  enhancedImage?: string;
  isLoading?: boolean;
  onDownload?: () => void;
  onClose?: () => void;
}

const ResultsDisplay = ({
  originalImage = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  enhancedImage = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  isLoading = false,
  onDownload = () => console.log("Download clicked"),
  onClose = () => console.log("Close clicked"),
}: ResultsDisplayProps) => {
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState<"original" | "enhanced">(
    "enhanced",
  );

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const toggleActiveImage = () => {
    setActiveImage((prev) => (prev === "original" ? "enhanced" : "original"));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Results</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <X size={18} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Desktop View - Side by Side */}
          <div className="hidden md:flex gap-4 h-[500px]">
            <div className="flex-1 relative overflow-hidden border rounded-lg bg-gray-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={originalImage}
                  alt="Original Image"
                  className="object-contain transition-transform duration-200 ease-in-out"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Original
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden border rounded-lg bg-gray-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={enhancedImage}
                  alt="Enhanced Image"
                  className="object-contain transition-transform duration-200 ease-in-out"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Enhanced
              </div>
            </div>
          </div>

          {/* Mobile View - Swipeable Single Image */}
          <div className="md:hidden relative h-[350px] border rounded-lg bg-gray-50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={activeImage === "original" ? originalImage : enhancedImage}
                alt={
                  activeImage === "original"
                    ? "Original Image"
                    : "Enhanced Image"
                }
                className="object-contain transition-transform duration-200 ease-in-out"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {activeImage === "original" ? "Original" : "Enhanced"}
            </div>
            <button
              onClick={toggleActiveImage}
              className="absolute top-1/2 -translate-y-1/2 left-2 bg-black/50 text-white p-2 rounded-full"
              aria-label="Previous image"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={toggleActiveImage}
              className="absolute top-1/2 -translate-y-1/2 right-2 bg-black/50 text-white p-2 rounded-full"
              aria-label="Next image"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                aria-label="Zoom out"
              >
                <ZoomOut size={18} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
                aria-label="Zoom in"
              >
                <ZoomIn size={18} />
              </Button>
              <span className="inline-flex items-center px-2 text-sm text-gray-600">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>

            <Button
              onClick={onDownload}
              className={cn(
                "gap-2",
                !enhancedImage && "opacity-50 cursor-not-allowed",
              )}
              disabled={!enhancedImage}
            >
              <Download size={18} />
              Download Enhanced Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
