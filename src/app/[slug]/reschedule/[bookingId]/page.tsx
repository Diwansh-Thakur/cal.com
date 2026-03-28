import { prisma } from "@/lib/prisma";
import BookingFlow from "../../BookingFlow";
import { generateAvailableSlots } from "@/lib/slots";
import { format } from "date-fns";
import { notFound } from "next/navigation";

// Generate full month of calendar slots
function getAvailableSlots(duration: number, bufferTime: number, availabilities: any[], overrides: any[], existingBookings: any[]) {
  const result: Record<string, string[]> = {};
  
  // Create slots for the next 30 days
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    
    // Set to 00:00:00 to represent the day
    d.setHours(0,0,0,0);
    const dateKey = format(d, "yyyy-MM-dd");
    
    // Call the slot engine
    const dates = generateAvailableSlots(d, duration, bufferTime, availabilities, overrides, existingBookings);
    result[dateKey] = dates.map(dt => dt.toISOString());
  }

  return result;
}

export default async function ReschedulePage({ params }: { params: Promise<{ slug: string, bookingId: string }> }) {
  const { slug, bookingId } = await params;
  const oldBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { eventType: { include: { user: { include: { schedules: { include: { availabilities: true, dateOverrides: true } } } } } } }
  });

  if (!oldBooking || oldBooking.eventType.slug !== slug) {
    if (!oldBooking) console.log("Booking not found");
    return notFound();
  }

  const event = oldBooking.eventType;
  const user = event.user;
  
  // Find which schedule to use. Default to user's first schedule if no explicit link
  const schedule = event.scheduleId 
    ? user.schedules.find(s => s.id === event.scheduleId) 
    : user.schedules[0];
    
  if (!schedule) return notFound();

  // Get ALL existing bookings for this user to check for overlaps
  // (We exclude the old booking so it doesn't block the same slot)
  const existingBookings = await prisma.booking.findMany({
    where: { 
      userId: user.id,
      endTime: { gte: new Date() },
      id: { not: oldBooking.id }
    }
  });

  const slotsByDate = getAvailableSlots(
    event.duration,
    event.bufferTime || 0,
    schedule.availabilities,
    schedule.dateOverrides,
    existingBookings
  );

  return (
    <>
      <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-semibold border-b border-yellow-200 shadow-sm animate-in slide-in-from-top">
        You are rescheduling a {event.title} previously set for {format(new Date(oldBooking.startTime), "MMM d, h:mm a")}
      </div>
      <BookingFlow 
        event={event} 
        user={user} 
        slotsByDate={slotsByDate} 
        rescheduledFromId={oldBooking.id}
      />
    </>
  );
}
