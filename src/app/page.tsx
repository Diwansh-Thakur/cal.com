import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, ChevronRight, UserCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
    include: {
      eventTypes: {
        where: { isActive: true },
        orderBy: { duration: "asc" }
      }
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-center p-8 bg-card rounded-2xl border shadow-sm">
          <p className="font-semibold text-lg mb-2">User not found</p>
          <p className="text-sm">Please ensure the database is seeded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-[Inter,sans-serif] antialiased bg-gradient-to-br from-background via-muted/30 flex flex-col pt-16 lg:pt-24 items-center">
      
      {/* Top Navbar */}
      <div className="absolute top-0 w-full p-4 flex justify-end items-center gap-4">
        <Link href="/dashboard" className="text-sm font-medium hover:underline text-muted-foreground transition-colors flex items-center gap-2">
          <UserCircle className="w-4 h-4" /> Admin Dashboard
        </Link>
        <ThemeToggle />
      </div>
      
      <main className="max-w-[700px] w-full px-5 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-[88px] h-[88px] rounded-full bg-foreground text-background flex items-center justify-center text-4xl font-black shadow-lg mb-6 ring-4 ring-background">
            {user.name?.charAt(0) || "U"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-foreground">{user.name}</h1>
          <p className="text-muted-foreground text-[15px] sm:text-[16px] max-w-sm mx-auto leading-relaxed">
            Welcome to my scheduling page. Please select an event from below to book some time with me.
          </p>
        </div>

        {/* Event Types List */}
        <div className="bg-card/90 backdrop-blur-2xl border border-border/60 rounded-3xl shadow-xl overflow-hidden divide-y divide-border/60 transition-all">
          {user.eventTypes.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground font-medium flex flex-col items-center gap-3 bg-muted/20">
              <Clock className="w-8 h-8 opacity-20" />
              There are no active events to book right now.
            </div>
          ) : (
            user.eventTypes.map((event) => (
              <Link 
                key={event.id} 
                href={`/${event.slug}`}
                className="group flex items-center justify-between p-6 sm:p-7 hover:bg-muted/50 transition-all duration-300"
              >
                <div className="pr-6">
                  <h2 className="text-[17px] sm:text-[19px] font-bold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                    {event.title}
                  </h2>
                  <div className="text-muted-foreground font-semibold flex items-center gap-2 text-[13px] sm:text-[14px] bg-muted w-fit px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> {event.duration} minutes
                  </div>
                  {event.description && (
                    <p className="text-muted-foreground/80 mt-3 text-[14px] line-clamp-2 max-w-lg leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300 bg-card shadow-sm shrink-0">
                  <ChevronRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>

      </main>
    </div>
  );
}
