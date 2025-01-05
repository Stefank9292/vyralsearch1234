import { CreditCard, Moon, Sun, HelpCircle, MessageCircle, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface SidebarSettingsProps {
  currentPath: string;
  subscriptionStatus: any;
}

export function SidebarSettings({ currentPath, subscriptionStatus }: SidebarSettingsProps) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const isCreatorPro = subscriptionStatus?.priceId === "price_1QdBd2DoPDXfOSZFnG8aWuIq";

  // Effect to sync state with actual theme
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const secondaryMenuItems = [
    {
      title: isCreatorPro ? "Upgrade to Creator on Steroids" : "Manage Subscription",
      icon: isCreatorPro ? Zap : CreditCard,
      url: "/subscribe",
      showWhen: (subscriptionStatus: any) => subscriptionStatus?.subscribed,
      className: isCreatorPro ? 
        "bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-white hover:from-[#FFE55C] hover:via-[#FFB52E] hover:to-[#FFA033] transition-all duration-300" 
        : undefined
    },
    {
      title: "Upgrade to Pro",
      icon: Star,
      url: "/subscribe",
      className: "text-orange-600 dark:text-orange-400",
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
      icon: isDark ? Sun : Moon,
      onClick: () => {
        document.documentElement.classList.toggle('dark');
      },
      className: "group",
    },
  ];

  return (
    <div className="px-2 py-2">
      <span className="text-[11px] text-sidebar-foreground/70 px-2">Settings</span>
      <div className="mt-2 space-y-1">
        {secondaryMenuItems.map((item) => {
          // Skip rendering if showWhen condition is defined and returns false
          if (item.showWhen && !item.showWhen(subscriptionStatus)) {
            return null;
          }

          const IconComponent = item.icon;
          
          return (
            <button
              key={item.title}
              onClick={item.onClick || (item.url ? () => navigate(item.url) : undefined)}
              className={`w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-[11px] ${
                item.className || 
                (item.url && currentPath === item.url 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/20')
              } transition-colors`}
            >
              <IconComponent 
                className={`h-3.5 w-3.5 transition-transform duration-500 ease-spring
                  ${isCreatorPro && item.icon === Zap ? 'animate-bounce' : ''}
                  ${item.icon === Sun || item.icon === Moon ? 'group-hover:rotate-45' : ''}`} 
              />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}