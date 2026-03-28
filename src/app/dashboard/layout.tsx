"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Link2, Clock, CalendarDays, Settings, ExternalLink } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Event Types", href: "/dashboard", icon: Link2 },
    { name: "Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { name: "Availability", href: "/dashboard/availability", icon: Clock },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-muted/30 font-[Inter,sans-serif] text-sm text-foreground">
      {/* Sidebar */}
      <aside className="w-[240px] border-r border-border bg-card flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="w-5 h-5 bg-foreground rounded-sm flex items-center justify-center text-background text-[10px]">C.</div>
              cal.com
            </div>
          </div>
          <nav className="px-3 pt-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border space-y-4">
           <Link href="/30-min-meeting" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium">
             <ExternalLink className="w-4 h-4" />
             View public page
           </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[72rem] mx-auto p-8 sm:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
