import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Clock, Calendar, X } from "lucide-react";
import { cancelBooking } from "../actions";

export default async function BookingsPage() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    include: { 
      bookings: {
        include: { eventType: true },
        orderBy: { startTime: 'asc' }
      } 
    }
  });

  const bookings = user?.bookings || [];
  const now = new Date();
  
  const upcoming = bookings.filter(b => b.startTime >= now);
  const past = bookings.filter(b => b.startTime < now);

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">See upcoming and past events booked through your links.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Upcoming</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border shadow-sm">
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              You have no upcoming bookings.
            </div>
          ) : upcoming.map(b => (
            <div key={b.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:bg-muted/50 transition-colors">
              <div className="space-y-2">
                <div className="font-semibold text-foreground text-base">
                  {b.name} <span className="text-gray-400 font-normal ml-2">{b.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(b.startTime), "EEEE, MMMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {format(new Date(b.startTime), "h:mm a")} - {format(new Date(b.endTime), "h:mm a")}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600">{b.eventType.title}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a href={`/${b.eventType.slug}/reschedule/${b.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors border border-transparent hover:border-blue-100">
                  Reschedule
                </a>
                <form action={async () => {
                  "use server";
                  await cancelBooking(b.id);
                }}>
                  <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors border border-transparent hover:border-red-100">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-10">Past</h2>
        <div className="bg-white border rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm opacity-60">
          {past.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No past bookings.
            </div>
          ) : past.map(b => (
            <div key={b.id} className="p-5 flex items-start justify-between bg-gray-50">
              <div className="space-y-2">
                <div className="font-semibold text-gray-900">
                  {b.name}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{format(new Date(b.startTime), "MMM d, yyyy")}</span>
                  <span>{format(new Date(b.startTime), "h:mm a")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
