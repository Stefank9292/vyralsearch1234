import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTools } from "./sidebar/SidebarTools";
import { SidebarSettings } from "./sidebar/SidebarSettings";
import { SidebarNavigation } from "./sidebar/SidebarNavigation";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { RequestUsageCounter } from "./RequestUsageCounter";

export function AppSidebar() {
  const location = useLocation();
  const { state, setOpen } = useSidebar();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        throw error;
      }
      return session;
    },
  });

  const { data: subscriptionStatus } = useSubscription(session);

  useEffect(() => {
    let collapseTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(collapseTimer);
      if (state === 'expanded') {
        collapseTimer = setTimeout(() => {
          setOpen(false);
        }, 20000); // 20 seconds
      }
    };

    // Reset timer on mouse movement within sidebar
    const handleMouseMove = () => {
      resetTimer();
    };

    // Add event listener to sidebar element
    const sidebarElement = document.querySelector('[data-sidebar="sidebar"]');
    if (sidebarElement) {
      sidebarElement.addEventListener('mousemove', handleMouseMove);
    }

    // Initial timer setup
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(collapseTimer);
      if (sidebarElement) {
        sidebarElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [state, setOpen]);

  // Handle loading state
  if (isSessionLoading) {
    return null;
  }

  // If there's no session after loading, don't render the sidebar
  if (!session) {
    return null;
  }

  return (
    <Sidebar className="z-30">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col h-full">
            <div className="space-y-6">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarNavigation />
                </SidebarMenuItem>

                <SidebarTools currentPath={location.pathname} />
              </SidebarMenu>
            </div>

            <div className="mt-auto space-y-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="h-px bg-sidebar-border mx-2 my-4" />
                </SidebarMenuItem>

                <SidebarSettings 
                  currentPath={location.pathname}
                  subscriptionStatus={subscriptionStatus}
                />

                <SidebarMenuItem>
                  <Separator className="my-4" />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <RequestUsageCounter />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarFooter />
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}