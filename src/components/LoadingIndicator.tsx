import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  size?: number;
  text?: string;
  className?: string;
}

const LoadingIndicator = ({
  size = 40,
  text = "Processing your image...",
  className = "",
}: LoadingIndicatorProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md ${className}`}
    >
      <Loader2 className="animate-spin text-primary" size={size} />
      <p className="mt-4 text-center text-gray-700">{text}</p>
    </div>
  );
};

export default LoadingIndicator;
