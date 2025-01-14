import { X, History, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TikTokIcon } from "@/components/icons/TikTokIcon";

interface TikTokRecentSearchesProps {
  onSelect: (username: string) => void;
}

export const TikTokRecentSearches = ({ onSelect }: TikTokRecentSearchesProps) => {
  const [hiddenSearches, setHiddenSearches] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('tiktokRecentSearchesCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!session?.access_token,
  });

  const isSteroidsUser = subscriptionStatus?.priceId === "price_1Qdt4NGX13ZRG2XiMWXryAm9" || 
                        subscriptionStatus?.priceId === "price_1Qdt5HGX13ZRG2XiUW80k3Fk";

  useEffect(() => {
    if (!isSteroidsUser) return;

    const channel = supabase
      .channel('tiktok-search-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tiktok_search_history'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['recent-tiktok-searches'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, isSteroidsUser]);

  useEffect(() => {
    localStorage.setItem('tiktokRecentSearchesCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const extractUsername = (query: string): string => {
    // Handle full TikTok URLs
    if (query.includes('tiktok.com/')) {
      const username = query.split('tiktok.com/')[1]?.split('/')[0];
      // Remove @ if present in the URL
      return `@${username?.replace('@', '')}`;
    }
    // Handle @username format or plain username
    return query.startsWith('@') ? query : `@${query}`;
  };

  const formatTikTokUrl = (query: string): string => {
    // Extract clean username regardless of input format
    let username = query;
    
    // If it's a full URL, extract username part
    if (query.includes('tiktok.com/')) {
      username = query.split('tiktok.com/')[1]?.split('/')[0] || '';
    }
    
    // Remove @ if present, we'll add it back in the correct position
    username = username.replace('@', '');
    
    // Return properly formatted URL
    return `https://www.tiktok.com/@${username}`;
  };

  const { data: recentSearches = [] } = useQuery({
    queryKey: ['recent-tiktok-searches'],
    queryFn: async () => {
      if (!isSteroidsUser) return [];
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('tiktok_search_history')
        .select('id, search_query')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent TikTok searches:', error);
        throw error;
      }

      return data || [];
    },
    enabled: isSteroidsUser,
  });

  const handleRemove = async (id: string) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('tiktok_search_history')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      setHiddenSearches(prev => [...prev, id]);
      queryClient.invalidateQueries({ queryKey: ['recent-tiktok-searches'] });
    } catch (error) {
      console.error('Error removing search:', error);
    }
  };

  const visibleSearches = recentSearches.filter(search => !hiddenSearches.includes(search.id));

  if (!isSteroidsUser) {
    return (
      <div className="w-full flex flex-col items-center space-y-4 mt-6">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground font-medium">Recent Searches Locked</span>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          Recent searches are only available on the{' '}
          <Link 
            to="/subscribe" 
            className="instagram-gradient bg-clip-text text-transparent font-semibold animate-synchronized-pulse hover:opacity-80 transition-opacity"
          >
            Creator on Steroids
          </Link>{' '}
          plan
        </p>
      </div>
    );
  }

  if (visibleSearches.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-6">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-200 
                 bg-gray-50/50 dark:bg-gray-800/30 transition-colors rounded-lg"
      >
        <History className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span className="font-medium">Recent Searches</span>
        {isCollapsed ? (
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        ) : (
          <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        )}
      </button>
      
      <div
        className={cn(
          "w-full grid place-items-center transition-all duration-300 ease-in-out",
          isCollapsed ? "max-h-0 opacity-0 overflow-hidden" : "max-h-[500px] opacity-100"
        )}
      >
        <div className="w-full flex flex-wrap justify-center gap-2.5">
          {visibleSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm"
            >
              <TikTokIcon className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSelect(formatTikTokUrl(search.search_query))}
                  className="text-[11px] font-medium text-gray-800 dark:text-gray-200"
                >
                  {extractUsername(search.search_query)}
                </button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(search.id)}
              >
                <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                <span className="sr-only">Remove search</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};