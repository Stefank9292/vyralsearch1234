import { Card } from "@/components/ui/card";
import { useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function TikTokSearch() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    // This will be implemented later when the TikTok search functionality is ready
    console.log("TikTok search for:", username);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  return (
    <div className="container max-w-screen-xl mx-auto p-4 pt-20 md:pt-6 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">TikTok Search</h1>
        <div className="max-w-xl mx-auto space-y-4">
          <SearchBar
            username={username}
            onUsernameChange={handleUsernameChange}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              disabled={!username.trim() || isLoading}
              className="w-full max-w-[200px]"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-center">
          Coming soon! This feature is currently under development.
        </p>
      </Card>
    </div>
  );
}