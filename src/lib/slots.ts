import { addMinutes, isBefore, isSameDay, parse, startOfDay } from "date-fns";

export type Availability = {
  dayOfWeek: number;
  startTime: string; 
  endTime: string;   
};

export type DateOverride = {
  date: Date;
  startTime: string | null;
  endTime: string | null;
};

export type Booking = {
  startTime: Date;
  endTime: Date;
};

export function generateAvailableSlots(
  date: Date,
  durationMinutes: number,
  bufferTime: number,
  availabilities: Availability[],
  overrides: DateOverride[],
  existingBookings: Booking[]
): Date[] {
  
  // Check overrides first
  const targetDateStart = startOfDay(date).getTime();
  const override = overrides.find(o => startOfDay(o.date).getTime() === targetDateStart);

  let workStartStr: string | null = null;
  let workEndStr: string | null = null;

  if (override) {
    if (!override.startTime || !override.endTime) return []; // Blocked day
    workStartStr = override.startTime;
    workEndStr = override.endTime;
  } else {
    const dayOfWeek = date.getDay();
    const availability = availabilities.find((a) => a.dayOfWeek === dayOfWeek);
    if (!availability) return []; // No working hours
    workStartStr = availability.startTime;
    workEndStr = availability.endTime;
  }

  const workStart = parse(workStartStr, "HH:mm", date);
  const workEnd = parse(workEndStr, "HH:mm", date);

  let currentSlotStart = workStart;
  const availableSlots: Date[] = [];
  const now = new Date();

  const totalRequiredTime = durationMinutes + bufferTime;

  while (
    isBefore(addMinutes(currentSlotStart, durationMinutes), workEnd) ||
    currentSlotStart.getTime() + durationMinutes * 60000 === workEnd.getTime()
  ) {
    const currentSlotEndWithBuffer = addMinutes(currentSlotStart, totalRequiredTime);
    const currentSlotEndExact = addMinutes(currentSlotStart, durationMinutes);

    // If the slot itself goes beyond work hours, break
    if (isBefore(workEnd, currentSlotEndExact)) break;

    // Filter past slots
    if (isBefore(currentSlotStart, now) && isSameDay(date, now)) {
      currentSlotStart = addMinutes(currentSlotStart, 30);
      continue;
    }

    // Check overlaps against bookings (using duration + buffer)
    const hasConflict = existingBookings.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return (
        (currentSlotStart >= bookingStart && currentSlotStart < bookingEnd) ||
        (currentSlotEndWithBuffer > bookingStart && currentSlotEndWithBuffer <= bookingEnd) ||
        (currentSlotStart <= bookingStart && currentSlotEndWithBuffer >= bookingEnd)
      );
    });

    if (!hasConflict) {
      availableSlots.push(currentSlotStart);
    }

    currentSlotStart = addMinutes(currentSlotStart, 30);
  }

  return availableSlots;
}
