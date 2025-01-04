import { CreditCard, LogOut, Moon, HelpCircle, MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarSection } from "./SidebarSection";

interface SidebarSettingsProps {
  currentPath: string;
  subscriptionStatus: any;
}

export function SidebarSettings({ currentPath, subscriptionStatus }: SidebarSettingsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const secondaryMenuItems = [
    {
      title: "Manage Subscription",
      icon: CreditCard,
      url: "/subscribe",
      showWhen: (subscriptionStatus: any) => subscriptionStatus?.subscribed,
    },
    {
      title: "Upgrade to Pro",
      icon: Star,
      url: "/subscribe",
      className: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
      showWhen: (subscriptionStatus: any) => !subscriptionStatus?.subscribed,
    },
    {
      title: "Help Center",
      icon: HelpCircle,
      url: "/help",
    },
    {
      title: "FAQs",
      icon: MessageCircle,
      url: "/faq",
    },
    {
      title: "Dark Mode",
      icon: Moon,
      onClick: () => {
        document.documentElement.classList.toggle('dark');
      },
    },
    {
      title: "Sign Out",
      icon: LogOut,
      onClick: async () => {
        await supabase.auth.signOut();
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate("/auth");
      },
    },
  ];

  return (
    <SidebarSection
      title="SETTINGS"
      items={secondaryMenuItems}
      subscriptionStatus={subscriptionStatus}
      onNavigate={navigate}
      currentPath={currentPath}
    />
  );
}