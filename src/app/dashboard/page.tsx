import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Clock, Copy, Settings, ChevronDown, Check, Trash2, ExternalLink } from "lucide-react";
import { deleteEventType } from "./actions";
import { CopyLinkButton } from "./CopyLinkButton";
import { ToggleEventButton } from "./ToggleEventButton";

export default async function DashboardPage() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    include: { eventTypes: true }
  });

  const eventTypes = user?.eventTypes || [];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] leading-8 font-semibold text-foreground font-sans tracking-tight">Event Types</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Create events to share for people to book on your calendar.</p>
        </div>
        <Link href="/dashboard/event-types/new">
          <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-md px-4 py-2 font-medium">
            + New
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden divide-y divide-border/60 shadow-sm">
        {eventTypes.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No event types found. Create one to get started.
          </div>
        )}
        
        {eventTypes.map((event: any) => (
          <div key={event.id} className="p-5 flex items-center justify-between group hover:bg-muted/50 transition-colors">
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Link href={`/dashboard/event-types/${event.id}/edit`} className="font-semibold text-foreground group-hover:underline">
                  {event.title}
                </Link>
              </div>
              <div className="text-[14px] text-muted-foreground font-medium flex items-center gap-x-2">
                <Link href={`/${event.slug}`} target="_blank" className="hover:text-foreground">/{event.slug}</Link>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {event.duration}m</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ToggleEventButton id={event.id} initialActive={event.isActive} />

              <div className="flex border border-border rounded-md overflow-hidden bg-card shadow-sm">
                <CopyLinkButton slug={event.slug} />
                <form action={async () => { "use server"; await deleteEventType(event.id); }}>
                  <button className="px-2 py-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
