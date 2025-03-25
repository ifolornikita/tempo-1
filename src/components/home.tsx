import React, { useState } from "react";
import Header from "./Header";
import ImageUploadArea from "./ImageUploadArea";
import ChatInterface from "./ChatInterface";
import EnhanceButton, { EnhanceType } from "./EnhanceButton";
import ResultsDisplay from "./ResultsDisplay";
import LoadingIndicator from "./LoadingIndicator";
import ApiCredentialsForm from "./ApiCredentialsForm";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! Upload an image, enter your Azure Computer Vision credentials, and tell me how you'd like to enhance it. You can remove the background, make it black & white, or make it more colorful.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [activeEnhanceType, setActiveEnhanceType] =
    useState<EnhanceType | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);

    // Reset enhanced image and results when a new image is uploaded
    setEnhancedImageUrl("");
    setShowResults(false);
    setError("");
    setActiveEnhanceType(null);
  };

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand what you want to do with your image. Click one of the enhancement buttons when you're ready to process your image.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getEnhancementEndpoint = (type: EnhanceType) => {
    switch (type) {
      case "background":
        return `${endpoint}/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval`;
      case "blackwhite":
        return `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=smartCrops&smartCropsAspectRatios=1:1&modelVersion=latest`;
      case "colorful":
        return `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=smartCrops&smartCropsAspectRatios=1:1&modelVersion=latest`;
      default:
        return `${endpoint}/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval`;
    }
  };

  const getLoadingText = (type: EnhanceType) => {
    switch (type) {
      case "background":
        return "Removing background with Azure Computer Vision...";
      case "blackwhite":
        return "Converting to black & white with Azure Computer Vision...";
      case "colorful":
        return "Enhancing colors with Azure Computer Vision...";
      default:
        return "Processing image with Azure Computer Vision...";
    }
  };

  const getCompletionMessage = (type: EnhanceType) => {
    switch (type) {
      case "background":
        return "I've removed the background from your image using Azure Computer Vision. You can view the results below and download the enhanced version.";
      case "blackwhite":
        return "I've converted your image to black & white using Azure Computer Vision. You can view the results below and download the enhanced version.";
      case "colorful":
        return "I've enhanced the colors in your image using Azure Computer Vision. You can view the results below and download the enhanced version.";
      default:
        return "I've processed your image using Azure Computer Vision. You can view the results below and download the enhanced version.";
    }
  };

  const getDownloadFileName = (type: EnhanceType) => {
    switch (type) {
      case "background":
        return "background-removed.png";
      case "blackwhite":
        return "black-and-white.png";
      case "colorful":
        return "color-enhanced.png";
      default:
        return "enhanced-image.png";
    }
  };

  const processBlackAndWhite = async (file: File) => {
    // Create a canvas to convert the image to black and white
    const canvas = document.createElement("canvas");
    const img = new Image();

    return new Promise<Blob>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }

        // Put the modified image data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not convert canvas to blob"));
          }
        }, "image/png");
      };

      img.onerror = () => {
        reject(new Error("Could not load image"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const processColorful = async (file: File) => {
    // Create a canvas to enhance colors
    const canvas = document.createElement("canvas");
    const img = new Image();

    return new Promise<Blob>((resolve, reject) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Enhance saturation
        for (let i = 0; i < data.length; i += 4) {
          // Convert RGB to HSL
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h,
            s,
            l = (max + min) / 2;

          if (max === min) {
            h = s = 0; // achromatic
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
              default:
                h = 0;
            }

            h /= 6;
          }

          // Increase saturation
          s = Math.min(s * 1.5, 1);

          // Convert back to RGB
          const hslToRgb = (h: number, s: number, l: number) => {
            let r, g, b;

            if (s === 0) {
              r = g = b = l; // achromatic
            } else {
              const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
              };

              const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
              const p = 2 * l - q;

              r = hue2rgb(p, q, h + 1 / 3);
              g = hue2rgb(p, q, h);
              b = hue2rgb(p, q, h - 1 / 3);
            }

            return [r * 255, g * 255, b * 255];
          };

          const [r2, g2, b2] = hslToRgb(h, s, l);

          data[i] = r2;
          data[i + 1] = g2;
          data[i + 2] = b2;
        }

        // Put the modified image data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not convert canvas to blob"));
          }
        }, "image/png");
      };

      img.onerror = () => {
        reject(new Error("Could not load image"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleEnhanceImage = async (type: EnhanceType) => {
    if (!uploadedImage) return;
    if (!apiKey || !location || !endpoint) {
      setError("Please provide all Azure Computer Vision credentials");
      return;
    }

    setIsProcessing(true);
    setError("");
    setActiveEnhanceType(type);

    try {
      let blob;

      if (type === "background") {
        // Call Azure Computer Vision API for background removal
        const response = await fetch(getEnhancementEndpoint(type), {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": location,
          },
          body: uploadedImage,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || "Failed to process image",
          );
        }

        // The response is the processed image
        blob = await response.blob();
      } else if (type === "blackwhite") {
        // Process black and white locally
        blob = await processBlackAndWhite(uploadedImage);
      } else if (type === "colorful") {
        // Process colorful locally
        blob = await processColorful(uploadedImage);
      } else {
        throw new Error("Unknown enhancement type");
      }

      const enhancedUrl = URL.createObjectURL(blob);
      setEnhancedImageUrl(enhancedUrl);
      setIsProcessing(false);
      setShowResults(true);

      // Add a message from AI about the completed enhancement
      const completionMessage: Message = {
        id: Date.now().toString(),
        content: getCompletionMessage(type),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    } catch (err) {
      console.error("Error processing image:", err);
      setIsProcessing(false);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the image",
      );

      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `There was an error processing your image: ${err instanceof Error ? err.message : "Unknown error"}. Please check your Azure credentials and try again.`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setActiveEnhanceType(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDownload = () => {
    if (!enhancedImageUrl || !activeEnhanceType) return;

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = enhancedImageUrl;
    a.download = getDownloadFileName(activeEnhanceType);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <ApiCredentialsForm
              apiKey={apiKey}
              location={location}
              endpoint={endpoint}
              onApiKeyChange={setApiKey}
              onLocationChange={setLocation}
              onEndpointChange={setEndpoint}
            />
            <ImageUploadArea
              onImageUpload={handleImageUpload}
              initialImage={uploadedImageUrl}
            />
            <EnhanceButton
              onClick={handleEnhanceImage}
              isLoading={isProcessing}
              isDisabled={!uploadedImage || !apiKey || !location || !endpoint}
              activeType={activeEnhanceType}
            />
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>

          <div>
            <ChatInterface
              onSendMessage={handleSendMessage}
              messages={messages}
              isLoading={isProcessing}
            />
          </div>
        </div>

        {isProcessing && (
          <div className="my-8">
            <LoadingIndicator
              text={
                activeEnhanceType
                  ? getLoadingText(activeEnhanceType)
                  : "Processing image..."
              }
            />
          </div>
        )}

        {showResults && (
          <div className="my-8">
            <ResultsDisplay
              originalImage={uploadedImageUrl}
              enhancedImage={enhancedImageUrl}
              onDownload={handleDownload}
            />
          </div>
        )}
      </main>

      <footer className="border-t mt-12 py-6 text-center text-gray-500 text-sm">
        <p>AI Image Enhancement Web App &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;
