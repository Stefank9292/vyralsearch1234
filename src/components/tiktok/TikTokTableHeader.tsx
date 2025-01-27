import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PenLine, Clock, Eye, Heart, MessageSquare, Zap, Link, Share2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SortDirection } from "./TikTokTableContent";

interface TableHeaderProps {
  onSort: (key: string) => void;
  sortKey?: string;
  sortDirection?: SortDirection;
}

export const TikTokTableHeader = ({ onSort, sortKey, sortDirection }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-b border-border/50">
        <TableHead onClick={() => onSort('channel.username')} className="group cursor-pointer hover:bg-muted/50 h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <User className={cn(
                "h-3.5 w-3.5 text-muted-foreground",
                sortKey === 'channel.username' && "text-primary"
              )} />
            </TooltipTrigger>
            <TooltipContent>Username</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Caption</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('uploadedAtFormatted')} className="group cursor-pointer hover:bg-muted/50 text-center h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <Clock className={cn(
                "h-3.5 w-3.5 text-muted-foreground",
                sortKey === 'uploadedAtFormatted' && "text-primary"
              )} />
            </TooltipTrigger>
            <TooltipContent>Date</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('views')} className="group cursor-pointer hover:bg-muted/50 text-center h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <Eye className={cn(
                "h-3.5 w-3.5 text-green-500",
                sortKey === 'views' && "text-primary"
              )} />
            </TooltipTrigger>
            <TooltipContent>Views</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('shares')} className="group cursor-pointer hover:bg-muted/50 text-center h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <Share2 className={cn(
                "h-3.5 w-3.5 text-violet-500",
                sortKey === 'shares' && "text-primary"
              )} />
            </TooltipTrigger>
            <TooltipContent>Shares</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('likes')} className="group cursor-pointer hover:bg-muted/50 text-center h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <Heart className={cn(
                "h-3.5 w-3.5 text-rose-500",
                sortKey === 'likes' && "text-primary"
              )} />
            </TooltipTrigger>
            <TooltipContent>Likes</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('comments')} className="group cursor-pointer hover:bg-muted/50 text-center h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <MessageSquare className={cn(
                "h-3.5 w-3.5 text-blue-400",
                sortKey === 'comments' && "text-primary"
              )} />
            </TooltipTrigger>
            <TooltipContent>Comments</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead onClick={() => onSort('engagement')} className="group cursor-pointer hover:bg-muted/50 text-center h-12">
          <Tooltip>
            <TooltipTrigger className="w-full flex items-center justify-center">
              <Zap className={cn(
                "h-3.5 w-3.5 text-orange-500",
                sortKey === 'engagement' && "text-primary"
              )} />
            </TooltipTrigger>
            <TooltipContent>Engagement</TooltipContent>
          </Tooltip>
        </TableHead>
        <TableHead className="text-center h-12">
          <Tooltip>
            <TooltipTrigger>
              <Link className="h-3.5 w-3.5 mx-auto text-rose-400" />
            </TooltipTrigger>
            <TooltipContent>Open URL</TooltipContent>
          </Tooltip>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};