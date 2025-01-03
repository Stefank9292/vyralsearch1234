import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        throw new Error('Authentication error');
      }
      
      if (!session?.user?.email) {
        console.error('No authenticated session found');
        navigate('/auth');
        throw new Error('No authenticated session found');
      }

      const { data, error: functionError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }
      
      return data;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Subscription check error:', error);
        toast({
          title: "Error checking subscription",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    }
  });

  const getClickLimit = () => {
    if (!subscriptionStatus) return 3; // Default to free plan limit
    return subscriptionStatus.maxClicks || 3; // Use maxClicks from API or default to 3
  };

  const handleClick = () => {
    const clickLimit = getClickLimit();
    if (clickCount < clickLimit) {
      setClickCount(prev => prev + 1);
      toast({
        title: "Crown clicked!",
        description: `You have ${clickLimit - clickCount - 1} clicks remaining.`,
      });
    } else {
      toast({
        title: "Click limit reached",
        description: `You have reached the maximum number of clicks (${clickLimit}).`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome to the App</h1>
        
        <div className="space-y-2">
          <p>You have clicked {clickCount} times</p>
          <p>Your current limit is: {getClickLimit()} clicks</p>
          
          <button
            onClick={handleClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
          >
            Click me!
          </button>
        </div>

        {subscriptionStatus?.subscribed ? (
          <div className="p-4 bg-green-100 rounded">
            <p>You are subscribed! 🎉</p>
            {subscriptionStatus.canceled && (
              <p className="text-yellow-600">Your subscription will end at the end of the current period</p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 rounded">
            <p>You are on the Free plan</p>
            <button
              onClick={() => navigate('/subscribe')}
              className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
            >
              Upgrade now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;