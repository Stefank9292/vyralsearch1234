import { HelpCircle, Calendar as CalendarIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { LucideIcon } from "lucide-react";

interface FilterInputProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helpText?: string;
  type?: string;
  isDatePicker?: boolean;
}

export const FilterInput = ({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  placeholder, 
  helpText,
  type = "text",
  isDatePicker = false
}: FilterInputProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'dd.MM.yyyy'));
    }
  };

  const handleResetDate = () => {
    onChange('');
  };

  if (isDatePicker) {
    // Calculate the date 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <label className="text-xs font-medium">{label}</label>
          {helpText && <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="text"
                placeholder={placeholder}
                value={value}
                className="h-8 text-xs pl-8"
                readOnly
              />
              <CalendarIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
              {value && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={handleResetDate}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value.split('.').reverse().join('-')) : undefined}
              onSelect={handleDateSelect}
              disabled={(date) => {
                return date > new Date() || date < ninetyDaysAgo;
              }}
              initialFocus
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
        {helpText && <p className="text-[10px] text-muted-foreground">{helpText}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <label className="text-xs font-medium">{label}</label>
        {helpText && <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />}
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs"
      />
      {helpText && <p className="text-[10px] text-muted-foreground">{helpText}</p>}
    </div>
  );
};