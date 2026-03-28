import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = "admin@example.com";

// ──────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Cal.com Clone API — Express.js Backend", status: "running" });
});

// ──────────────────────────────────────────────
// USERS
// ──────────────────────────────────────────────

// GET /api/users/me — get the admin user profile
app.get("/api/users/me", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { eventTypes: true, schedules: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PUT /api/users/me — update the admin user profile
app.put("/api/users/me", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const user = await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { name },
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update user" });
  }
});

// ──────────────────────────────────────────────
// EVENT TYPES
// ──────────────────────────────────────────────

// GET /api/event-types — get all event types for the admin user
app.get("/api/event-types", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { eventTypes: true },
    });
    return res.json(user?.eventTypes ?? []);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch event types" });
  }
});

// GET /api/event-types/slug/:slug — get a single event type by its URL slug
app.get("/api/event-types/slug/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const event = await prisma.eventType.findUnique({
      where: { slug },
      include: { user: true },
    });
    if (!event) return res.status(404).json({ error: "Event type not found" });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch event type" });
  }
});

// POST /api/event-types — create a new event type
app.post("/api/event-types", async (req: Request, res: Response) => {
  try {
    const { title, slug, duration, bufferTime, description, customQuestions } = req.body;
    if (!title || !slug || !duration) {
      return res.status(400).json({ error: "title, slug and duration are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { schedules: true },
    });
    if (!user) return res.status(404).json({ error: "Admin user not found" });

    const event = await prisma.eventType.create({
      data: {
        title,
        slug,
        duration: parseInt(duration),
        bufferTime: bufferTime ? parseInt(bufferTime) : 0,
        description: description || null,
        customQuestions: customQuestions || null,
        userId: user.id,
        scheduleId: user.schedules[0]?.id ?? null,
      },
    });
    return res.status(201).json(event);
  } catch (err: any) {
    if (err.code === "P2002") return res.status(409).json({ error: "Slug already exists" });
    return res.status(500).json({ error: "Failed to create event type" });
  }
});

// PUT /api/event-types/:id — update an event type
app.put("/api/event-types/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, duration, bufferTime, description, customQuestions } = req.body;

    const event = await prisma.eventType.update({
      where: { id },
      data: {
        title,
        slug,
        duration: parseInt(duration),
        bufferTime: bufferTime ? parseInt(bufferTime) : 0,
        description: description || null,
        customQuestions: customQuestions || null,
      },
    });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update event type" });
  }
});

// PATCH /api/event-types/:id/toggle — toggle isActive
app.patch("/api/event-types/:id/toggle", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const event = await prisma.eventType.update({
      where: { id },
      data: { isActive },
    });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ error: "Failed to toggle event type" });
  }
});

// DELETE /api/event-types/:id — delete an event type
app.delete("/api/event-types/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.eventType.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete event type" });
  }
});

// ──────────────────────────────────────────────
// BOOKINGS
// ──────────────────────────────────────────────

// GET /api/bookings — get all bookings for the admin user
app.get("/api/bookings", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { eventType: true },
      orderBy: { startTime: "asc" },
    });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// POST /api/bookings — create a new booking
app.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    const { name, email, startTime, endTime, eventTypeId, userId, notes, rescheduledFromId } = req.body;

    if (!name || !email || !startTime || !endTime || !eventTypeId || !userId) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    const eventType = await prisma.eventType.findUnique({ where: { id: eventTypeId } });

    // Simulate sending confirmation email
    console.log(`\n📧 [EMAIL SIMULATION] -> Booking Confirmation
To: ${email}
Subject: Confirmed: ${name} and You – ${eventType?.title}
Time: ${new Date(startTime).toLocaleString()}
Notes: ${notes || "None"}
--------------------------------------------------\n`);

    // If rescheduling, delete the old booking first
    if (rescheduledFromId) {
      await prisma.booking.delete({ where: { id: rescheduledFromId } });
      console.log(`[EMAIL SIMULATION] -> Sent cancellation for rescheduled booking`);
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        responses: notes || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        eventTypeId,
        userId,
        rescheduledFromId: rescheduledFromId || null,
      },
    });
    return res.status(201).json({ id: booking.id });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create booking" });
  }
});

// DELETE /api/bookings/:id — cancel a booking
app.delete("/api/bookings/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { eventType: true },
    });

    if (booking) {
      console.log(`\n📧 [EMAIL SIMULATION] -> Booking Cancelled
To: ${booking.email}
Subject: Canceled: ${booking.name} – ${booking.eventType.title}
Body: The meeting at ${booking.startTime} has been canceled.
--------------------------------------------------\n`);
      await prisma.booking.delete({ where: { id } });
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// ──────────────────────────────────────────────
// AVAILABILITY / SCHEDULES
// ──────────────────────────────────────────────

// GET /api/schedules — get all schedules with availability for the admin user
app.get("/api/schedules", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const schedules = await prisma.schedule.findMany({
      where: { userId: user.id },
      include: { availabilities: true, dateOverrides: true },
    });
    return res.json({ user, schedules });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch schedules" });
  }
});

// POST /api/schedules — create a new schedule
app.post("/api/schedules", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const schedule = await prisma.schedule.create({
      data: { name, userId: user.id },
    });

    // Create default Mon–Fri 9-5 availability
    const defaultAvails = [1, 2, 3, 4, 5].map((day) => ({
      dayOfWeek: day,
      startTime: "09:00",
      endTime: "17:00",
      scheduleId: schedule.id,
    }));
    await prisma.availability.createMany({ data: defaultAvails });

    return res.status(201).json(schedule);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create schedule" });
  }
});

// PUT /api/schedules/:id — update availability settings + timezone
app.put("/api/schedules/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { timezone, availabilities } = req.body;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: { availabilities: true, user: true },
    });
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    if (timezone) {
      await prisma.user.update({
        where: { id: schedule.userId },
        data: { timezone },
      });
    }

    if (availabilities && Array.isArray(availabilities)) {
      for (const av of availabilities) {
        if (av.id && av.startTime && av.endTime) {
          await prisma.availability.update({
            where: { id: av.id },
            data: { startTime: av.startTime, endTime: av.endTime },
          });
        }
      }
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update schedule" });
  }
});

// POST /api/schedules/:id/date-overrides — add a date override
app.post("/api/schedules/:id/date-overrides", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;
    if (!date) return res.status(400).json({ error: "date is required" });

    const override = await prisma.dateOverride.create({
      data: {
        date: new Date(date),
        startTime: startTime || null,
        endTime: endTime || null,
        scheduleId: id,
      },
    });
    return res.status(201).json(override);
  } catch (err) {
    return res.status(500).json({ error: "Failed to add date override" });
  }
});

// DELETE /api/date-overrides/:id — delete a date override
app.delete("/api/date-overrides/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.dateOverride.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete date override" });
  }
});

// ──────────────────────────────────────────────
// AVAILABLE SLOTS (for public booking page)
// ──────────────────────────────────────────────

// GET /api/slots/:slug — compute available time slots for a given event type
app.get("/api/slots/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const event = await prisma.eventType.findUnique({
      where: { slug },
      include: {
        user: true,
        schedule: {
          include: { availabilities: true, dateOverrides: true },
        },
      },
    });

    if (!event || !event.schedule) {
      return res.json({ event: null, slotsByDate: {} });
    }

    const { schedule, duration, bufferTime } = event;
    const totalSlotMinutes = duration + bufferTime;

    // Get all existing bookings for this user in the next 60 days
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 60);

    const existingBookings = await prisma.booking.findMany({
      where: {
        userId: event.userId,
        startTime: { gte: now, lte: cutoff },
      },
    });

    const slotsByDate: Record<string, string[]> = {};

    for (let i = 0; i < 60; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      day.setHours(0, 0, 0, 0);

      const dayOfWeek = day.getDay();
      const dateKey = day.toISOString().split("T")[0]!;

      // Check for date override
      const override = schedule.dateOverrides.find((o) => {
        const d = new Date(o.date);
        return d.toISOString().split("T")[0] === dateKey;
      });

      let startTime: string | null = null;
      let endTime: string | null = null;

      if (override) {
        startTime = override.startTime;
        endTime = override.endTime;
      } else {
        const avail = schedule.availabilities.find((a) => a.dayOfWeek === dayOfWeek);
        if (avail) {
          startTime = avail.startTime;
          endTime = avail.endTime;
        }
      }

      if (!startTime || !endTime) continue;

      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      const slots: string[] = [];
      let current = new Date(day);
      current.setHours(sh!, sm!, 0, 0);

      const end = new Date(day);
      end.setHours(eh!, em!, 0, 0);

      while (current.getTime() + duration * 60000 <= end.getTime()) {
        const slotEnd = new Date(current.getTime() + duration * 60000);

        // Check if slot conflicts with existing bookings
        const conflict = existingBookings.some((b) => {
          return current < new Date(b.endTime) && slotEnd > new Date(b.startTime);
        });

        if (!conflict && current > now) {
          slots.push(current.toISOString());
        }

        current = new Date(current.getTime() + totalSlotMinutes * 60000);
      }

      if (slots.length > 0) {
        slotsByDate[dateKey] = slots;
      }
    }

    return res.json({ event, slotsByDate });
  } catch (err) {
    return res.status(500).json({ error: "Failed to compute slots" });
  }
});

// ──────────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Express Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Routes:`);
  console.log(`   GET    /api/users/me`);
  console.log(`   PUT    /api/users/me`);
  console.log(`   GET    /api/event-types`);
  console.log(`   POST   /api/event-types`);
  console.log(`   PUT    /api/event-types/:id`);
  console.log(`   PATCH  /api/event-types/:id/toggle`);
  console.log(`   DELETE /api/event-types/:id`);
  console.log(`   GET    /api/bookings`);
  console.log(`   POST   /api/bookings`);
  console.log(`   DELETE /api/bookings/:id`);
  console.log(`   GET    /api/schedules`);
  console.log(`   POST   /api/schedules`);
  console.log(`   PUT    /api/schedules/:id`);
  console.log(`   POST   /api/schedules/:id/date-overrides`);
  console.log(`   DELETE /api/date-overrides/:id`);
  console.log(`   GET    /api/slots/:slug\n`);
});
