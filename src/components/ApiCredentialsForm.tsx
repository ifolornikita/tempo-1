import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ApiCredentialsFormProps {
  apiKey: string;
  location: string;
  endpoint: string;
  onApiKeyChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onEndpointChange: (value: string) => void;
}

const ApiCredentialsForm = ({
  apiKey = "",
  location = "",
  endpoint = "",
  onApiKeyChange = () => {},
  onLocationChange = () => {},
  onEndpointChange = () => {},
}: ApiCredentialsFormProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm mb-4">
      <h3 className="text-lg font-medium mb-3">
        Azure Computer Vision Credentials
      </h3>
      <div className="space-y-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            type="password"
            id="apiKey"
            placeholder="Enter your Azure API Key"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            id="location"
            placeholder="e.g. eastus, westeurope"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="endpoint">Endpoint</Label>
          <Input
            type="text"
            id="endpoint"
            placeholder="e.g. https://your-resource.cognitiveservices.azure.com/"
            value={endpoint}
            onChange={(e) => onEndpointChange(e.target.value)}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        <a
          href="https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/how-to/background-removal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Learn how to get Azure Computer Vision credentials
        </a>
      </p>
    </div>
  );
};

export default ApiCredentialsForm;
