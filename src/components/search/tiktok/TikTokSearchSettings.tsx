import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, HelpCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TikTokSearchSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  location: string;
  setLocation: (location: string) => void;
  disabled?: boolean;
}

export const TikTokSearchSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  dateRange,
  setDateRange,
  location,
  setLocation,
  disabled = false,
}: TikTokSearchSettingsProps) => {
  const dateRangeOptions = [
    { label: "Default", value: "DEFAULT" },
    { label: "All Time", value: "ALL_TIME" },
    { label: "Yesterday", value: "YESTERDAY" },
    { label: "This Week", value: "THIS_WEEK" },
    { label: "This Month", value: "THIS_MONTH" },
    { label: "Last Three Months", value: "LAST_THREE_MONTHS" },
  ];

  const locationOptions = [
    { label: "United States", value: "US" },
    { label: "Germany", value: "DE" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <button
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        className="inline-flex items-center justify-center gap-2 py-2 px-4 text-[11px] text-gray-700 dark:text-gray-200 
                 bg-gray-50/50 dark:bg-gray-800/30 transition-colors rounded-lg"
        disabled={disabled}
      >
        <Settings2 className="w-3.5 h-3.5" />
        <span className="font-medium">Search Settings</span>
      </button>

      {isSettingsOpen && (
        <div className="mt-2 p-3 space-y-4 bg-white dark:bg-gray-800 rounded-lg 
                      border border-gray-200/80 dark:border-gray-800/80 animate-in fade-in duration-200
                      w-full max-w-md mx-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">Date Range</span>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </div>
            <Select
              value={dateRange}
              onValueChange={setDateRange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-[11px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[11px]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">Location</span>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </div>
            <Select
              value={location}
              onValueChange={setLocation}
              disabled={disabled}
            >
              <SelectTrigger className="w-full h-8 text-[11px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[11px]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};