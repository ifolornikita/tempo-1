import React from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { ImageIcon } from "lucide-react";

interface HeaderProps {
  title?: string;
  className?: string;
}

const Header = ({ title = "AI Image Enhancement", className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "w-full h-20 bg-background border-b border-border flex items-center justify-between px-6 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <ImageIcon className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          Help
        </Button>
        <Button variant="outline" size="sm">
          About
        </Button>
      </div>
    </header>
  );
};

export default Header;
