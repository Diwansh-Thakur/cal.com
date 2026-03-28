import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateAvailableSlots } from "@/lib/slots";
import BookingFlow from "./BookingFlow";

export default async function BookingPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const event = await prisma.eventType.findUnique({
    where: { slug },
    include: {
      schedule: {
        include: { availabilities: true, dateOverrides: true }
      },
      user: {
        include: { bookings: true }
      }
    }
  });

  if (!event || !event.schedule) return notFound();

  // For the demo, we generate slots for the next 7 days based on today
  const today = new Date();
  
  // A naive generation of slots for the next 14 days
  const slotsByDate: Record<string, string[]> = {};
  
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    // Updated to use bufferTime and overrides
    const slots = generateAvailableSlots(
      d, 
      event.duration, 
      event.bufferTime,
      event.schedule.availabilities, 
      event.schedule.dateOverrides,
      event.user.bookings
    );

    if (slots.length > 0) {
      slotsByDate[d.toISOString().split("T")[0]] = slots.map(s => s.toISOString());
    }
  }

  return (
    <BookingFlow 
      event={{
        id: event.id,
        title: event.title,
        duration: event.duration,
        description: event.description,
        slug: event.slug,
      }}
      user={{
        id: event.user.id,
        name: event.user.name,
      }}
      slotsByDate={slotsByDate}
    />
  );
}
