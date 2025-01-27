import { Instagram, History, FileText, Twitter, Youtube } from "lucide-react";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Instagram Search",
    url: "/",
    icon: Instagram,
    badge: "LIVE"
  },
  {
    title: "TikTok Search",
    url: "/tiktok",
    icon: TikTokIcon,
    badge: "BETA"
  },
  {
    title: "Search History",
    url: "/history",
    icon: History
  },
  {
    title: "Script Generator",
    url: "/transcribe",
    icon: FileText,
    badge: "NEW"
  },
  {
    title: "Twitter Search",
    url: "#",
    icon: Twitter,
    className: "opacity-60 cursor-not-allowed"
  },
  {
    title: "YouTube Search",
    url: "#",
    icon: Youtube,
    className: "opacity-60 cursor-not-allowed"
  }
];