"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteEventType(id: string) {
  await prisma.eventType.delete({ where: { id } });
  revalidatePath("/dashboard");
}

export async function createEventType(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const durationStr = formData.get("duration") as string;
  const bufferTimeStr = formData.get("bufferTime") as string;
  const description = formData.get("description") as string;
  const customQuestions = formData.get("customQuestions") as string;

  if (!title || !slug || !durationStr) return;

  const duration = parseInt(durationStr, 10);
  const bufferTime = bufferTimeStr ? parseInt(bufferTimeStr, 10) : 0;
  
  const user = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
    include: { schedules: true }
  });

  if (!user || user.schedules.length === 0) return;

  await prisma.eventType.create({
    data: {
      title,
      slug,
      duration,
      bufferTime,
      description,
      customQuestions,
      userId: user.id,
      scheduleId: user.schedules[0].id // Default to primary schedule
    }
  });

  revalidatePath("/dashboard");
}

export async function updateAvailabilitySettings(formData: FormData) {
  const timezone = formData.get("timezone") as string;
  const scheduleId = formData.get("scheduleId") as string;
  
  if (!scheduleId) return;

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { availabilities: true, user: true }
  });

  if (!schedule) return;

  // Update timezone
  if (timezone) {
    await prisma.user.update({
      where: { id: schedule.userId },
      data: { timezone }
    });
  }

  // Update availabilities
  for (const av of schedule.availabilities) {
    const start = formData.get(`start-${av.id}`) as string;
    const end = formData.get(`end-${av.id}`) as string;
    
    if (start && end) {
      await prisma.availability.update({
        where: { id: av.id },
        data: { startTime: start, endTime: end }
      });
    }
  }

  revalidatePath("/dashboard/availability");
}

export async function cancelBooking(id: string) {
  const booking = await prisma.booking.findUnique({ where: { id }, include: { eventType: true } });
  if (booking) {
    console.log(`\n\n📧 [EMAIL SIMULATION] -> Cancelled Booking
To: ${booking.email}
Subject: Canceled: ${booking.name} - ${booking.eventType.title}
Body: The meeting scheduled for ${booking.startTime} has been canceled.
--------------------------------------------------\n\n`);
    await prisma.booking.delete({ where: { id } });
  }
  revalidatePath("/dashboard/bookings");
}

export async function createBooking(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;
  const eventTypeId = formData.get("eventTypeId") as string;
  const userId = formData.get("userId") as string;
  const notes = formData.get("notes") as string; 
  const rescheduledFromId = formData.get("rescheduledFromId") as string;

  if (!name || !email || !startTimeStr || !endTimeStr || !eventTypeId || !userId) return null;

  const eventType = await prisma.eventType.findUnique({ where: { id: eventTypeId } });

  console.log(`\n\n📧 [EMAIL SIMULATION] -> Booking Confirmation
To: ${email}
Subject: Confirmed: ${name} and You - ${eventType?.title}
Time: ${new Date(startTimeStr).toLocaleString()}
Notes: ${notes || "None"}
--------------------------------------------------\n\n`);

  if (rescheduledFromId) {
    await prisma.booking.delete({ where: { id: rescheduledFromId } });
    console.log(`[EMAIL SIMULATION] -> Sent cancellation for old booking (Rescheduled)`);
  }

  const booking = await prisma.booking.create({
    data: {
      name,
      email,
      responses: notes || null,
      startTime: new Date(startTimeStr),
      endTime: new Date(endTimeStr),
      eventTypeId,
      userId,
      rescheduledFromId: rescheduledFromId || null
    }
  });

  return booking.id;
}

export async function toggleEventTypeActive(id: string, isActive: boolean) {
  await prisma.eventType.update({
    where: { id },
    data: { isActive }
  });
  revalidatePath("/dashboard");
}

export async function updateProfileSettings(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;

  await prisma.user.update({
    where: { email: "admin@example.com" },
    data: { name }
  });
}

export async function updateEventType(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const durationStr = formData.get("duration") as string;
  const bufferTimeStr = formData.get("bufferTime") as string;
  const description = formData.get("description") as string;
  const customQuestions = formData.get("customQuestions") as string;

  if (!id || !title || !slug || !durationStr) return;

  const duration = parseInt(durationStr, 10);
  const bufferTime = bufferTimeStr ? parseInt(bufferTimeStr, 10) : 0;

  await prisma.eventType.update({
    where: { id },
    data: {
      title,
      slug,
      duration,
      bufferTime,
      description,
      customQuestions,
    }
  });

  revalidatePath("/dashboard");
}

export async function addDateOverride(formData: FormData) {
  const scheduleId = formData.get("scheduleId") as string;
  const dateStr = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  if (!scheduleId || !dateStr) return;

  await prisma.dateOverride.create({
    data: {
      date: new Date(dateStr),
      startTime: startTime || null,
      endTime: endTime || null,
      scheduleId
    }
  });

  revalidatePath("/dashboard/availability");
}

export async function deleteDateOverride(id: string) {
  await prisma.dateOverride.delete({ where: { id } });
  revalidatePath("/dashboard/availability");
}

export async function createSchedule(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;
  
  const user = await prisma.user.findUnique({ where: { email: "admin@example.com" } });
  if (!user) return;
  
  const schedule = await prisma.schedule.create({
    data: { name, userId: user.id }
  });
  
  const defaultAvails = [1, 2, 3, 4, 5].map(day => ({
    dayOfWeek: day,
    startTime: "09:00",
    endTime: "17:00",
    scheduleId: schedule.id
  }));
  
  await prisma.availability.createMany({ data: defaultAvails });
  revalidatePath("/dashboard/availability");
}
