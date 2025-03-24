import React, { useState } from "react";
import Header from "./Header";
import ImageUploadArea from "./ImageUploadArea";
import ChatInterface from "./ChatInterface";
import EnhanceButton from "./EnhanceButton";
import ResultsDisplay from "./ResultsDisplay";
import LoadingIndicator from "./LoadingIndicator";

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
        "Hello! Upload an image and tell me how you'd like to enhance it.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);

    // Reset enhanced image and results when a new image is uploaded
    setEnhancedImageUrl("");
    setShowResults(false);
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
          "I understand what you want to do with your image. Click the 'Enhance Image' button when you're ready to proceed.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleEnhanceImage = () => {
    if (!uploadedImage) return;

    setIsProcessing(true);

    // Simulate image processing
    setTimeout(() => {
      // For demo purposes, we're just using the same image
      // In a real app, this would be the result from the AI enhancement
      setEnhancedImageUrl(uploadedImageUrl);
      setIsProcessing(false);
      setShowResults(true);

      // Add a message from AI about the completed enhancement
      const completionMessage: Message = {
        id: Date.now().toString(),
        content:
          "I've enhanced your image according to your instructions. You can view the results below and download the enhanced version.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    }, 3000);
  };

  const handleDownload = () => {
    if (!enhancedImageUrl) return;

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = enhancedImageUrl;
    a.download = "enhanced-image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <ImageUploadArea
              onImageUpload={handleImageUpload}
              initialImage={uploadedImageUrl}
            />
            <EnhanceButton
              onClick={handleEnhanceImage}
              isLoading={isProcessing}
              isDisabled={!uploadedImage || messages.length <= 1}
            />
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
            <LoadingIndicator text="Enhancing your image with AI..." />
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
