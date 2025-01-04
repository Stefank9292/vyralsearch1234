import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInstagramPosts, fetchBulkInstagramPosts } from "@/utils/instagram/apifyClient";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchSettings } from "@/components/search/SearchSettings";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Loader2, Search } from "lucide-react";
import { useSearchStore } from "../store/searchStore";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Index = () => {
  const {
    username,
    numberOfVideos,
    selectedDate,
    filters,
    setUsername,
    setNumberOfVideos,
    setSelectedDate,
    setFilters,
    resetFilters
  } = useSearchStore();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBulkSearching, setIsBulkSearching] = useState(false);
  const [bulkSearchResults, setBulkSearchResults] = useState<any[]>([]);
  const [shouldSearch, setShouldSearch] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Get subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  // Get current day's request count
  const { data: requestCount = 0 } = useQuery({
    queryKey: ['request-count'],
    queryFn: async () => {
      if (!session?.user.id) return 0;
      
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const { count } = await supabase
        .from('user_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('request_type', 'instagram_search')
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

      return count || 0;
    },
    enabled: !!session?.user.id,
  });

  // Get max requests based on subscription
  const getMaxRequests = () => {
    if (!subscriptionStatus?.priceId) return 25; // Free tier
    if (subscriptionStatus.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq") return 100; // Premium
    if (subscriptionStatus.priceId === "price_1QdC54DoPDXfOSZFXHBO4yB3") return 500; // Ultra
    return 25; // Default to free tier
  };

  const hasReachedLimit = requestCount >= getMaxRequests();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['instagram-posts', username, numberOfVideos, selectedDate],
    queryFn: () => fetchInstagramPosts(username, numberOfVideos, selectedDate),
    enabled: Boolean(username) && shouldSearch,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    meta: {
      onSuccess: () => {
        setShouldSearch(false);
      },
      onError: (error: Error) => {
        console.error('Search error:', error);
        toast({
          title: "Error",
          description: "Failed to perform search",
          variant: "destructive",
        });
        setShouldSearch(false);
      }
    }
  });

  const handleSearch = () => {
    if (isLoading || isBulkSearching) {
      return;
    }

    if (!username) {
      toast({
        title: "Error",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return;
    }

    setBulkSearchResults([]);
    setShouldSearch(true);
  };

  const handleBulkSearch = async (urls: string[], numVideos: number, date: Date | undefined) => {
    if (isLoading || isBulkSearching) {
      return;
    }

    setIsBulkSearching(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['instagram-posts'] });
      const results = await fetchBulkInstagramPosts(urls, numVideos, date);
      setBulkSearchResults(results);
      return results;
    } catch (error) {
      console.error('Bulk search error:', error);
      throw error;
    } finally {
      setIsBulkSearching(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const displayPosts = bulkSearchResults.length > 0 ? bulkSearchResults : posts;

  return (
    <div className="responsive-container flex flex-col items-center justify-start min-h-screen py-16 md:py-24 space-y-16 animate-in fade-in duration-300">
      <div className="space-y-8">
        <SearchHeader />
        <p className="text-muted-foreground text-lg md:text-xl text-center max-w-2xl mx-auto">
          Save time finding viral content for social media
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-12">
        <div className="space-y-6">
          <SearchBar
            username={username}
            onUsernameChange={setUsername}
            onSearch={handleSearch}
            onBulkSearch={handleBulkSearch}
            isLoading={isLoading || isBulkSearching}
          />

          <Button 
            onClick={handleSearch} 
            disabled={isLoading || isBulkSearching || !username || hasReachedLimit}
            className={cn(
              "w-full material-button py-8 text-lg md:text-xl transition-all duration-300",
              username ? "instagram-gradient" : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
              "text-white dark:text-gray-100 shadow-lg hover:shadow-xl",
              hasReachedLimit && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                <span>This can take up to a minute...</span>
              </>
            ) : hasReachedLimit ? (
              <>
                <Search className="mr-3 h-6 w-6" />
                Daily Limit Reached ({requestCount}/{getMaxRequests()})
              </>
            ) : (
              <>
                <Search className="mr-3 h-6 w-6" />
                Search Viral Videos
              </>
            )}
          </Button>
        </div>

        <SearchSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          numberOfVideos={numberOfVideos}
          setNumberOfVideos={setNumberOfVideos}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          disabled={isLoading || isBulkSearching}
        />
      </div>

      {displayPosts.length > 0 && (
        <div className="w-full max-w-[90rem] space-y-12">
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            totalResults={displayPosts.length}
            filteredResults={displayPosts.filter(post => {
              if (filters.postsNewerThan) {
                const filterDate = new Date(filters.postsNewerThan.split('.').reverse().join('-'));
                const postDate = new Date(post.timestamp);
                if (postDate < filterDate) return false;
              }
              if (filters.minViews && post.playsCount < parseInt(filters.minViews)) return false;
              if (filters.minPlays && post.viewsCount < parseInt(filters.minPlays)) return false;
              if (filters.minLikes && post.likesCount < parseInt(filters.minLikes)) return false;
              if (filters.minComments && post.commentsCount < parseInt(filters.minComments)) return false;
              if (filters.minDuration && post.duration < filters.minDuration) return false;
              if (filters.minEngagement && parseFloat(post.engagement) < parseFloat(filters.minEngagement)) return false;
              return true;
            }).length}
            currentPosts={displayPosts}
          />
          <div className="material-card overflow-hidden animate-in fade-in duration-300">
            <SearchResults posts={displayPosts} filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;