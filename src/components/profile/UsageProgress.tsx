import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

interface UsageProgressProps {
  isUltraPlan: boolean;
  usagePercentage: number;
  usedRequests: number;
  maxRequests: number;
  remainingRequests: number;
  hasReachedLimit: boolean;
}

export const UsageProgress = ({
  isUltraPlan,
  usagePercentage,
  usedRequests,
  maxRequests,
  remainingRequests,
  hasReachedLimit,
}: UsageProgressProps) => {
  return (
    <div className="w-full space-y-2 px-3 py-2 bg-card/30 rounded-lg border border-border/50">
      <div className="flex items-center justify-between text-[10px] text-sidebar-foreground/70">
        <div className="flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          <span>Monthly Usage</span>
        </div>
        {!isUltraPlan && (
          <span className="text-primary/70">{remainingRequests} left</span>
        )}
      </div>

      <div className="space-y-2">
        {isUltraPlan ? (
          <div className="text-[9px] text-sidebar-foreground/60 flex items-center justify-center gap-1">
            <span className="bg-gradient-to-r from-[#D946EF] via-[#E1306C] to-[#8B5CF6] text-transparent bg-clip-text animate-pulse font-medium">
              Unlimited Usage
            </span>
            <span className="text-green-500">•</span>
            <span>{usedRequests} requests this month</span>
          </div>
        ) : (
          <>
            <Progress value={usagePercentage} className="h-1 bg-sidebar-accent/20" />
            <div className="flex justify-between text-[9px] text-sidebar-foreground/60">
              <span>{usedRequests}/{maxRequests} requests</span>
              {hasReachedLimit && (
                <Link 
                  to="/subscribe" 
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Upgrade plan →
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};