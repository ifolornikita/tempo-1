import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  messages?: Message[];
  isLoading?: boolean;
}

const ChatInterface = ({
  onSendMessage = () => {},
  messages: initialMessages = [
    {
      id: "1",
      content:
        "Hello! Upload an image and tell me how you'd like to enhance it.",
      sender: "ai",
      timestamp: new Date(),
    },
  ],
  isLoading = false,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    onSendMessage(inputValue);
    setInputValue("");

    // Simulate AI response for demo purposes
    if (!isLoading) {
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-medium">Chat with AI Assistant</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar className="h-8 w-8 mt-1">
                {message.sender === "ai" ? (
                  <>
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-assistant"
                      alt="AI"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`mx-2 p-3 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-assistant"
                  alt="AI"
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="mx-2 p-3 rounded-lg bg-gray-100">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe how you want to enhance your image..."
            className="resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === "" || isLoading}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
