import React, { useState } from "react";
import Header from "./Header";
import ImageUploadArea from "./ImageUploadArea";
import ChatInterface from "./ChatInterface";
import EnhanceButton from "./EnhanceButton";
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
        "Hello! Upload an image, enter your Azure Computer Vision credentials, and tell me how you'd like to enhance it. I'll help you remove the background.",
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

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);

    // Reset enhanced image and results when a new image is uploaded
    setEnhancedImageUrl("");
    setShowResults(false);
    setError("");
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
          "I understand what you want to do with your image. Click the 'Enhance Image' button when you're ready to remove the background.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleEnhanceImage = async () => {
    if (!uploadedImage) return;
    if (!apiKey || !location || !endpoint) {
      setError("Please provide all Azure Computer Vision credentials");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Convert the image to base64
      const base64Image = await fileToBase64(uploadedImage);
      const imageData = base64Image.split(",")[1]; // Remove the data URL prefix

      // Call Azure Computer Vision API for background removal
      const response = await fetch(
        `${endpoint}/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": apiKey,
            "Ocp-Apim-Subscription-Region": location,
          },
          body: uploadedImage,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to process image");
      }

      // The response is the processed image with background removed
      const blob = await response.blob();
      const enhancedUrl = URL.createObjectURL(blob);
      setEnhancedImageUrl(enhancedUrl);
      setIsProcessing(false);
      setShowResults(true);

      // Add a message from AI about the completed enhancement
      const completionMessage: Message = {
        id: Date.now().toString(),
        content:
          "I've removed the background from your image using Azure Computer Vision. You can view the results below and download the enhanced version.",
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
    if (!enhancedImageUrl) return;

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = enhancedImageUrl;
    a.download = "background-removed.png";
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
            <LoadingIndicator text="Removing background with Azure Computer Vision..." />
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
