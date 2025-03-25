import React, { useState } from "react";
import { Button } from "./ui/button";
import { Eraser } from "lucide-react";

interface EnhanceButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const EnhanceButton = ({
  onClick = () => {},
  isLoading = false,
  isDisabled = false,
}: EnhanceButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm">
      <Button
        size="lg"
        className={`w-full max-w-[200px] h-[50px] text-base font-semibold transition-all duration-300 ${hovered ? "bg-primary/90 scale-105" : "bg-primary"}`}
        onClick={onClick}
        disabled={isDisabled || isLoading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Eraser className="mr-2 h-5 w-5" />
        {isLoading ? "Processing..." : "Remove Background"}
      </Button>
      {isDisabled && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Please upload an image and provide Azure credentials first
        </p>
      )}
    </div>
  );
};

export default EnhanceButton;
