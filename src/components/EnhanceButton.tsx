import React, { useState } from "react";
import { Button } from "./ui/button";
import { Eraser, Palette, ImageIcon } from "lucide-react";

export type EnhanceType = "background" | "blackwhite" | "colorful";

interface EnhanceButtonProps {
  onClick?: (type: EnhanceType) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  activeType?: EnhanceType | null;
}

const EnhanceButton = ({
  onClick = () => {},
  isLoading = false,
  isDisabled = false,
  activeType = null,
}: EnhanceButtonProps) => {
  const [hovered, setHovered] = useState<EnhanceType | null>(null);

  const buttons = [
    {
      type: "background" as EnhanceType,
      label: "Remove Background",
      icon: Eraser,
      color: "bg-primary",
      hoverColor: "bg-primary/90",
    },
    {
      type: "blackwhite" as EnhanceType,
      label: "Make it Black & White",
      icon: ImageIcon,
      color: "bg-gray-800",
      hoverColor: "bg-gray-700",
    },
    {
      type: "colorful" as EnhanceType,
      label: "Make it Colorful",
      icon: Palette,
      color: "bg-indigo-600",
      hoverColor: "bg-indigo-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        {buttons.map((button) => {
          const isActive = activeType === button.type;
          const isButtonHovered = hovered === button.type;

          return (
            <Button
              key={button.type}
              size="lg"
              className={`w-full h-[50px] text-base font-semibold transition-all duration-300 ${button.color} hover:${button.hoverColor} ${isButtonHovered ? "scale-105" : ""} ${isActive ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
              onClick={() => onClick(button.type)}
              disabled={isDisabled || isLoading}
              onMouseEnter={() => setHovered(button.type)}
              onMouseLeave={() => setHovered(null)}
            >
              <button.icon className="mr-2 h-5 w-5" />
              {isLoading && isActive ? "Processing..." : button.label}
            </Button>
          );
        })}
      </div>
      {isDisabled && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Please upload an image and provide Azure credentials first
        </p>
      )}
    </div>
  );
};

export default EnhanceButton;
