import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchResultItem, SupabaseSearchResult } from "@/types/instagram";
import { transformSearchResults } from "@/utils/transformSearchResults";
import { SearchResultDetails } from "@/components/history/SearchResultDetails";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HistoryPage() {
  const [selectedSearchId, setSelectedSearchId] = useState<string>("");

  const { data: searchHistory = [] } = useQuery({
    queryKey: ['search-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching search history:', error);
        throw error;
      }

      return data;
    },
  });

  const { data: searchResult, isError } = useQuery({
    queryKey: ['search-result', selectedSearchId],
    queryFn: async () => {
      if (!selectedSearchId) return null;

      const { data, error } = await supabase
        .from('search_results')
        .select('*')
        .eq('search_history_id', selectedSearchId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching search result:', error);
        throw error;
      }

      if (!data) return null;
      return transformSearchResults(data as SupabaseSearchResult);
    },
    enabled: !!selectedSearchId
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Search History</h1>
        <Select value={selectedSearchId} onValueChange={setSelectedSearchId}>
          <SelectTrigger className={cn("w-full", !selectedSearchId && "text-muted-foreground")}>
            <SelectValue placeholder="Select a search to view results" />
          </SelectTrigger>
          <SelectContent>
            {searchHistory.map((search) => (
              <SelectItem key={search.id} value={search.id}>
                <div className="flex justify-between items-center gap-4">
                  <span>@{search.search_query}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(search.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load search results. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {selectedSearchId && !searchResult && !isError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No results found for this search.
          </AlertDescription>
        </Alert>
      )}

      {searchResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResult.results.map((result, index) => (
              <SearchResultDetails key={index} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}