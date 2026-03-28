# 📚 DEEP DIVE: Cal.com Clone — Complete Project Explained

> Every single tool, technology, file, line and concept explained from zero. No assumed knowledge.

---

## 🧠 PART 1 — WHY THIS PROJECT EXISTS

### What Problem Does It Solve?

Imagine you want someone to book a meeting with you. The old way: you email back and forth — "Are you free Tuesday?" "No, how about Thursday?" This wastes time.

Cal.com solves this by letting you:
1. Upload your available hours (e.g., Mon–Fri, 9 AM–5 PM)
2. Share a link (e.g., `yourname.cal.com/30-min-call`)
3. The other person opens the link, picks a time, and it's booked automatically

This project is a **clone** of that — built from scratch as a learning exercise with all the same core features.

---

## 🏗️ PART 2 — THE ARCHITECTURE (Big Picture)

### What Is Architecture?

Architecture means: "how do the different parts of this system talk to each other?"

Our system has **3 layers**:

```
┌───────────────────────────────────────────────────────┐
│                  BROWSER (User's Computer)             │
│          React / Next.js  →  port 3000                │
│   "What the user sees and clicks"                     │
└────────────────────────┬──────────────────────────────┘
                         │  HTTP requests (fetch)
                         ↓
┌───────────────────────────────────────────────────────┐
│              BACKEND SERVER (Express.js)               │
│               Node.js  →  port 5000                   │
│   "Business logic: validates data, talks to DB"       │
└────────────────────────┬──────────────────────────────┘
                         │  SQL queries (via Prisma)
                         ↓
┌───────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                     │
│   "Permanent storage: saves all data to disk"         │
└───────────────────────────────────────────────────────┘
```

### Why 3 Layers? Why Not Just One?

- **Separation of concerns**: each part does one job well
- **Security**: the database is never directly exposed to the browser
- **Scalability**: you can scale each layer independently
- **Testability**: you can test the API without running a browser

---

## 🛠️ PART 3 — EVERY TECHNOLOGY EXPLAINED

### 1. Next.js (Frontend Framework)

**What it is:** Next.js is built on top of React. React lets you build UIs using components. Next.js adds routing, server-side rendering, and a file-based page system on top of that.

**Why we use it:** 
- When you go to `/dashboard/bookings`, Next.js automatically renders the `bookings/page.tsx` file
- It has built-in optimization (code splitting, font loading, image optimization)
- It can run server-side code directly in your pages (like fetching from a database before the page loads)

**How routing works:**
```
src/app/
  page.tsx               → URL: /
  dashboard/
    page.tsx             → URL: /dashboard
    bookings/
      page.tsx           → URL: /dashboard/bookings
  [slug]/
    page.tsx             → URL: /anything (dynamic, e.g. /30-min-meeting)
    success/
      page.tsx           → URL: /anything/success
```

The `[slug]` folder in square brackets is a dynamic route. The value in the URL (`30-min-meeting`) gets passed to your page as a variable called `params.slug`.

---

### 2. React (UI Library)

**What it is:** A library for building UI by breaking it into reusable pieces called "components".

**Components** are like LEGO bricks. You build small pieces, then combine them into pages.

**State** is a component's memory. If the user clicks a date on the calendar, we remember that date in a `useState` variable.

```tsx
const [date, setDate] = useState(new Date()); 
// date = the current value
// setDate = the function to change it
// new Date() = the initial value (today)
```

When state changes, React automatically re-renders only the parts of the UI that depend on it.

---

### 3. TypeScript

**What it is:** JavaScript but with "types" — labels that tell you what kind of value a variable holds.

**Why use it:**
```typescript
// Without TypeScript — JavaScript
function greet(name) {
  return "Hello " + name.toUpperCase(); // What if name is a number? CRASH!
}

// With TypeScript
function greet(name: string) {
  return "Hello " + name.toUpperCase(); // TypeScript warns you if you pass a number
}
```

TypeScript catches bugs BEFORE the code runs. It acts like a spell-checker for your code logic.

---

### 4. Express.js (Backend Framework)

**What it is:** A minimal, fast web server for Node.js. It receives HTTP requests (GET, POST, DELETE, etc.) and sends back responses (usually JSON).

**Why Express:** It's the most popular, battle-tested Node.js framework. Simple to learn, very flexible.

**How it works:**
```typescript
app.get("/api/bookings", async (req, res) => {
  // req = the incoming request (URL, headers, body)
  // res = the outgoing response (what we send back)
  const bookings = await prisma.booking.findMany();
  res.json(bookings); // Send JSON back to the browser
});
```

---

### 5. Node.js (Runtime)

**What it is:** JavaScript normally runs only in the browser. Node.js lets JavaScript run on a server too — on your own computer or a cloud server.

**Why it matters:** Our Express.js backend is JavaScript code running via Node.js, outside any browser.

---

### 6. PostgreSQL (Database)

**What it is:** A powerful, open-source relational database. Data is stored in tables (like spreadsheets) with rows and columns. Tables can link to each other using IDs.

**Why PostgreSQL over others:**
- The assignment required PostgreSQL or MySQL
- PostgreSQL is more feature-rich (better data types, more strict)
- Industry standard for serious applications

**How relational data works:**
```
users table:
| id  | name  | email             |
|-----|-------|-------------------|
| u1  | Alice | alice@example.com |

bookings table:
| id  | name  | userId |   ← userId links to users.id
|-----|-------|--------|
| b1  | Bob   | u1     |   ← This booking belongs to Alice
```

---

### 7. Prisma (ORM — Object-Relational Mapper)

**What it is:** A tool that lets you write JavaScript/TypeScript to query your database, instead of raw SQL.

**Without Prisma (raw SQL):**
```sql
SELECT * FROM "Booking" WHERE "userId" = 'u1' ORDER BY "startTime" ASC;
```

**With Prisma:**
```typescript
const bookings = await prisma.booking.findMany({
  where: { userId: 'u1' },
  orderBy: { startTime: 'asc' }
});
```

Much more readable! And TypeScript knows exactly what shape the result will be.

**`schema.prisma`** is your "blueprint" file — it defines all your database tables and the relationships between them. When you run `npx prisma db push`, Prisma reads this file and creates or updates the actual tables in your database.

---

### 8. Tailwind CSS (Styling)

**What it is:** A CSS framework where you style elements by adding class names directly in your HTML/JSX.

**Traditional CSS:**
```css
/* styles.css */
.button {
  background-color: black;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}
```
```html
<button class="button">Click me</button>
```

**Tailwind:**
```html
<button class="bg-black text-white px-4 py-2 rounded-md">Click me</button>
```

Every class is a single CSS rule. It's faster to write, no switching between files. The `bg-black` = `background-color: black`, `text-white` = `color: white`, `px-4` = `padding-left: 1rem; padding-right: 1rem`, etc.

---

### 9. Shadcn UI (Component Library)

**What it is:** NOT a traditional component library (you don't install a package). Instead, Shadcn copies the component source code directly into your project so you can edit it.

**What it gives us:**
- `<Button>` — styled, accessible button with variants
- `<Input>` — styled text input field
- `<Calendar>` — full interactive calendar picker
- `<Label>` — form label that connects to inputs properly

These are pre-built, polished, accessible React components so we don't have to build them from scratch.

---

### 10. Lucide React (Icons)

**What it is:** A library of over 1000 clean, consistent SVG icons as React components.

**Usage:**
```tsx
import { Clock, Trash2, CalendarDays } from "lucide-react";

<Clock className="w-4 h-4" />  // Renders a clock icon
```

---

### 11. next-themes (Theme System)

**What it is:** A library that manages light/dark/system theme switching in Next.js apps.

**How it works:**
- It wraps your app in a `ThemeProvider` context
- When the user selects "dark", it adds `class="dark"` to `<html>`
- Tailwind's `dark:` variants then toggle different colors automatically:
  ```css
  /* background is white in light, dark gray in dark mode */
  bg-background  →  #ffffff (light)  or  #0f1117 (dark)
  ```

---

### 12. date-fns (Date Utility)

**What it is:** A utility library for working with JavaScript dates.

**Why needed:** JavaScript's built-in Date handling is notoriously confusing. date-fns makes it simple:

```typescript
import { format, parseISO } from "date-fns";

format(new Date(), "EEEE, MMMM d, yyyy")
// → "Saturday, March 29, 2025"

format(parseISO("2025-03-29T10:00:00Z"), "h:mm a")
// → "10:00 AM"
```

---

### 13. CORS (Cross-Origin Resource Sharing)

**What it is:** A browser security rule. By default, a browser blocks JavaScript from making requests to a different domain/port.

**The problem:** Our frontend runs on `localhost:3000`. Our Express backend runs on `localhost:5000`. Without CORS, the browser refuses to let the frontend talk to the backend.

**The fix:**
```typescript
import cors from "cors";
app.use(cors()); // "Allow requests from anywhere"
```

In production, you'd lock this down to only allow your specific frontend domain.

---

### 14. dotenv (Environment Variables)

**What it is:** A way to store secret values (database passwords, API keys) in a `.env` file instead of hardcoding them in your code.

**Why:** You wouldn't want your database password visible in your public GitHub repo!

**How it works:**
```bash
# .env file
DATABASE_URL="postgresql://user:secret@localhost:5432/mydb"
PORT=5000
```

```typescript
import dotenv from "dotenv";
dotenv.config(); // Load the .env file into process.env

const url = process.env.DATABASE_URL; // Read the value
```

The `.env` file is listed in `.gitignore`, so it never gets committed to Git.

---

## 📁 PART 4 — EVERY FILE EXPLAINED IN DEPTH

### ROOT LEVEL FILES

---

#### `package.json` (Frontend)

This is the "manifest" of your project. It lists:
- **`name`**: project name
- **`scripts`**: shortcuts for terminal commands (`npm run dev` → runs Next.js dev server)
- **`dependencies`**: packages needed to **run** the app (React, Next.js, etc.)
- **`devDependencies`**: packages only needed during **development** (TypeScript, type definitions)

```json
"scripts": {
  "dev": "next dev",    // Start development server at localhost:3000
  "build": "next build", // Compile for production
  "start": "next start"  // Run the compiled production build
}
```

---

#### `prisma/schema.prisma` (Database Blueprint)

Every `model` = one database table. Every field = one column in that table.

```prisma
generator client {
  provider = "prisma-client-js"
}
// ↑ Tells Prisma: generate a JavaScript client so we can query the DB in JS code

datasource db {
  provider = "postgresql"  // Which database type to use
  url      = env("DATABASE_URL")  // Read the connection string from .env
}
```

**User model:**
```prisma
model User {
  id        String  @id @default(cuid())
  // @id = this is the primary key (unique identifier for each row)
  // @default(cuid()) = auto-generate a unique ID (like "clh7x8j9a0000abc123")
  
  email     String  @unique
  // @unique = no two rows can have the same email
  
  name      String?
  // The ? means OPTIONAL — this field can be NULL in the database
  
  timezone  String  @default("UTC")
  // @default("UTC") = if no timezone is provided, use "UTC"
  
  schedules Schedule[]
  // [] means "one-to-many": one User has many Schedules
  // This is a relation — it doesn't create a column, it lets us use
  // prisma.user.findUnique({ include: { schedules: true } }) to load related data
}
```

**EventType model:**
```prisma
model EventType {
  slug    String @unique
  // slug is the URL-friendly name: "30-min-meeting"
  // It must be unique because two events can't share the same URL
  
  duration    Int
  // Int = integer (whole number). Stores duration in minutes (e.g., 30)
  
  bufferTime  Int @default(0)
  // Extra "break" time after each meeting before the next slot opens
  
  isActive    Boolean @default(true)
  // true = this event type is visible on the public page
  // false = hidden (turned off by the user)
  
  userId    String
  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)
  // userId = the actual column stored in the database (a foreign key)
  // user = a virtual link Prisma creates, so we can do event.user.name
  // onDelete: Cascade = if the User is deleted, delete all their EventTypes too
}
```

**Availability model:**
```prisma
model Availability {
  dayOfWeek  Int     // 0=Sunday, 1=Monday, 2=Tuesday ... 6=Saturday
  startTime  String  // "09:00" (stored as a string, e.g., "HH:MM")
  endTime    String  // "17:00"
  scheduleId String  // which schedule this day belongs to
  
  @@unique([scheduleId, dayOfWeek])
  // This combined unique rule means: you can't have two "Monday" rows
  // for the same schedule. One schedule = one row per day of week.
}
```

**Booking model:**
```prisma
model Booking {
  startTime  DateTime  // DateTime = a full timestamp (date + time + timezone)
  endTime    DateTime
  responses  String?   // Notes from the person who booked (optional)
  rescheduledFromId String?  // If this booking replaced an old one, store the old booking's ID
  createdAt  DateTime @default(now())  // Automatically set to "right now" when created
}
```

---

### `src/lib/prisma.ts` — The Database Connection Singleton

```typescript
import { PrismaClient } from '@prisma/client'
// PrismaClient is the class that knows how to connect to the database
// and execute queries like findMany(), create(), delete(), etc.

const prismaClientSingleton = () => {
  return new PrismaClient()
}
// A function that creates a new PrismaClient when called

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}
// This tells TypeScript: "there might be a global variable called 'prisma'"
// ReturnType<typeof prismaClientSingleton> = "whatever type prismaClientSingleton returns"

export const prisma = globalThis.prisma ?? prismaClientSingleton()
// globalThis = the global scope (works in both browser and Node.js)
// ?? = "nullish coalescing": use left side if it's not null/undefined, else use right side
// MEANING: If a global prisma already exists, reuse it. Otherwise, create one.

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
// In development, save the prisma client to the global variable
// WHY: Next.js hot-reloads (recompiles) code on every file save.
// Without this, each reload would create a new database connection,
// and you'd quickly exhaust the database's connection limit.
// In production, the server only starts once, so this isn't needed.
```

---

### `src/app/layout.tsx` — The Root HTML Shell

This file wraps **every single page** in the app. Think of it as the outer skeleton.

```tsx
import type { Metadata } from "next";
// Metadata is a TypeScript "type" — it defines the shape of SEO data

import { Inter } from "next/font/google";
// This instructs Next.js to download and self-host the Inter font from Google
// "self-host" = Next.js downloads the font and serves it from its own server,
// so the user's browser never needs to connect to Google's servers

import "./globals.css";
// Import global CSS styles (CSS variables, reset styles, Tailwind directives)

import { ThemeProvider } from "@/components/theme-provider";
// @/ is an alias for src/ — configured in tsconfig.json
// So @/components/theme-provider → src/components/theme-provider.tsx

const inter = Inter({ subsets: ["latin"] });
// Configure the font. "latin" subset = only download characters used in Latin-based
// languages (English, French, etc.) — smaller file = faster load

export const metadata: Metadata = {
  title: "Cal.com Clone",
  description: "Scheduling infrastructure for everyone.",
};
// This sets the browser tab title and the meta description tag
// Meta description appears in Google search results under the page title

export default function RootLayout({ children }) {
  // "children" is a special React prop that means "whatever is inside this component"
  // Since this is the root layout, children = whatever page the user is on
  
  return (
    <html lang="en" suppressHydrationWarning>
    // lang="en" helps screen readers and search engines
    // suppressHydrationWarning: when next-themes first loads, it changes the html
    // class (dark/light). Without this, React would warn about a "hydration mismatch"
    
      <body className={`${inter.className} min-h-screen bg-background ...`}>
      // inter.className = the auto-generated CSS class for the Inter font
      // min-h-screen = the body is at least as tall as the viewport
      // bg-background = uses a CSS variable that changes between light/dark modes
      
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
        // attribute="class" = toggle dark mode by adding/removing class="dark" on <html>
        // defaultTheme="system" = on first visit, respect the user's OS setting
        // enableSystem = allow "system" as a valid theme choice
        // disableTransitionOnChange={false} = allow smooth color transitions when theme changes
        
          {children}
          // Render the actual page content here
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### `src/app/dashboard/layout.tsx` — The Sidebar Layout

```tsx
"use client";
// This directive tells Next.js: "render this component in the browser, not on the server"
// We MUST do this because we use usePathname(), which reads the current URL —
// something only available in the browser, not during server-side rendering

import { usePathname } from "next/navigation";
// hook that returns the current browser URL path
// e.g., if user is at /dashboard/bookings → pathname = "/dashboard/bookings"

const navItems = [
  { name: "Event Types", href: "/dashboard", icon: Link2 },
  // Each item has: display text, the URL it links to, and an icon component
];

const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
// For the "Event Types" link (href="/dashboard"), it's only active when EXACTLY at /dashboard
// For other links (e.g., "/dashboard/bookings"), it's active if pathname STARTS WITH the href
// Why the special case for /dashboard? Because /dashboard/bookings starts with /dashboard,
// which would make "Event Types" look active when we're on the Bookings page.

return (
  <div className="flex h-screen ...">
  // flex = CSS Flexbox layout. By default, children are side by side (row)
  // h-screen = full viewport height
  
    <aside className="w-[240px] ...">
    // aside = HTML5 semantic element for sidebar content
    // w-[240px] = exactly 240px wide (Tailwind arbitrary value syntax)
    
    <main className="flex-1 overflow-y-auto">
    // flex-1 = "take up all remaining horizontal space" (next to the sidebar)
    // overflow-y-auto = if content is taller than the screen, show a scrollbar
    
      <div className="max-w-[72rem] mx-auto p-8">
      // max-w-[72rem] = content never gets wider than 1152px (readable on big monitors)
      // mx-auto = center the content horizontally with automatic margins
      
        {children}  // The actual dashboard page content goes here
```

---

### `src/app/dashboard/actions.ts` — Server Actions (Business Logic)

```typescript
"use server";
// Critical! Everything in this file runs on the SERVER (Node.js), never in the browser.
// The user cannot see this code or modify it via browser DevTools.
// This is where it's safe to read/write the database.

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// revalidatePath tells Next.js: "the data on this page has changed, re-fetch it"
// Without this, Next.js would show cached (old) data even after we made changes

export async function deleteEventType(id: string) {
  // async = this function is "asynchronous" — it can pause and wait for the database
  // We mark functions async when they do things that take time (DB queries, API calls)
  
  await prisma.eventType.delete({ where: { id } });
  // await = "pause here until the database operation finishes"
  // { where: { id } } = shorthand for { where: { id: id } } — delete WHERE id matches
  
  revalidatePath("/dashboard");
  // After deleting, tell Next.js to refresh the /dashboard page data
}

export async function createBooking(formData: FormData) {
  // FormData is a web API type — it holds the data submitted by an HTML <form>
  
  const name = formData.get("name") as string;
  // formData.get("name") gets the value of the form field named "name"
  // "as string" = TypeScript type assertion — we're saying "trust me, this is a string"
  
  const startTimeStr = formData.get("startTime") as string;
  
  const eventType = await prisma.eventType.findUnique({ where: { id: eventTypeId } });
  // findUnique = find exactly one row where the ID matches
  // Returns the EventType object or null if not found
  
  // Email simulation — in a real app, this would call SendGrid or similar
  console.log(`📧 [EMAIL SIMULATION] -> Booking Confirmation
To: ${email}
Subject: Confirmed: ${name} and You – ${eventType?.title}`);
  // The ?. is "optional chaining" — if eventType is null, this won't crash
  
  if (rescheduledFromId) {
    await prisma.booking.delete({ where: { id: rescheduledFromId } });
    // If this is a reschedule, delete the OLD booking before creating the new one
  }
  
  const booking = await prisma.booking.create({
    data: {
      startTime: new Date(startTimeStr),
      // new Date(string) converts a string like "2025-03-29T10:00:00Z" to a Date object
      // PostgreSQL needs a Date object, not a string
    }
  });
  
  return booking.id;
  // Return the new booking's ID so the frontend knows where to redirect
}
```

---

### `src/app/[slug]/page.tsx` — The Public Booking Page (Server)

```tsx
export default async function BookingPage({ params }) {
  const { slug } = await params;
  // slug is the dynamic part of the URL
  // If user visits /30-min-meeting, slug = "30-min-meeting"
  
  const event = await prisma.eventType.findUnique({
    where: { slug },
    include: {
      schedule: {
        include: { availabilities: true, dateOverrides: true }
        // "include" = also fetch the related data (JOIN in SQL terms)
        // Without include, schedule would just be an ID, not the full object
      },
      user: {
        include: { bookings: true }
        // We need the user's existing bookings to check for conflicts
      }
    }
  });
  
  if (!event || !event.schedule) return notFound();
  // notFound() is a Next.js function that renders the 404 page
  // We show 404 if:
  // - No event with this slug exists in the database
  // - The event exists but has no schedule configured yet

  // Generate available time slots for the next 14 days
  const slotsByDate: Record<string, string[]> = {};
  // Record<string, string[]> means: an object where keys are strings and values are arrays of strings
  // Example: { "2025-03-29": ["2025-03-29T09:00:00Z", "2025-03-29T09:30:00Z"] }
  
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Add i days to today
    // i=0: today, i=1: tomorrow, i=2: day after, etc.
    
    const slots = generateAvailableSlots(d, event.duration, event.bufferTime, ...);
    // This function (from src/lib/slots.ts) figures out:
    // - What days/times this user is available (from Availability records)
    // - Which time slots are already booked (from Booking records)
    // - Returns only the free, open slots
    
    slotsByDate[d.toISOString().split("T")[0]] = slots.map(s => s.toISOString());
    // d.toISOString() → "2025-03-29T00:00:00.000Z"
    // .split("T")[0] → "2025-03-29" (just the date part, index 0)
  }
  
  return (
    <BookingFlow
      event={{ id, title, duration, description, slug }}
      user={{ id, name }}
      slotsByDate={slotsByDate}
    />
    // Pass the data as props to the client-side interactive component
  );
}
```

---

### `src/app/[slug]/BookingFlow.tsx` — The Interactive Calendar Component

This is a **client component** (runs in the browser) because it responds to user clicks.

```tsx
"use client";
// Must be client because we use useState (memory), and event handlers (clicks)

const [date, setDate] = useState<Date | undefined>(new Date());
// useState<Date | undefined> = this state can either be a Date or undefined
// Initial value: new Date() = today

// The full UI has 3 "views" controlled by the selectedSlot state:
// View 1: selectedSlot === null → show Calendar + Time Slots
// View 2: selectedSlot is set → show Booking Form

const dateKey = date ? format(date, "yyyy-MM-dd") : null;
// date ? ... : null = ternary operator: "if date exists, format it; else null"
// format(date, "yyyy-MM-dd") converts Date object to string "2025-03-29"
// This matches the keys in the slotsByDate object passed from the server

const availableSlots = dateKey && slotsByDate[dateKey] ? slotsByDate[dateKey] : [];
// If we have a dateKey AND there are slots for that date, use them
// Otherwise, use an empty array (no slots available)

// The 2-click slot selection (the "showConfirm" state):
// First click: slot appears highlighted, and a "Next" button appears next to it
// Second click (Next): selectedSlot is set and we go to the booking form
// WHY: Prevents accidental booking by requiring double confirmation of the time
const isConfirming = showConfirm === slot;
// isConfirming = true only for the specific slot the user just clicked

async function handleBook(formData: FormData) {
  setIsSubmitting(true);
  // Disable the button to prevent double-submitting
  
  formData.append("startTime", selectedSlot!);
  // Add the selected time to the form data
  // The ! after selectedSlot is TypeScript's "non-null assertion" = "I promise this isn't null"
  
  const endDate = new Date(new Date(selectedSlot!).getTime() + event.duration * 60000);
  // .getTime() = gets the timestamp in milliseconds since 1970
  // event.duration * 60000 = convert minutes to milliseconds (1 min = 60,000 ms)
  // Adding them gives us the end time
  
  formData.append("endTime", endDate.toISOString());
  
  const bookingId = await createBooking(formData);
  // Calls the server action — saves the booking to the database
  
  if (bookingId) {
    router.push(`/${event.slug}/success?date=${selectedSlot}`);
    // router.push = programmatic navigation (redirect without full page reload)
    // ?date=${selectedSlot} = URL query parameter, used by the success page
    // to display the booked time
  }
}
```

---

### `src/app/dashboard/availability/page.tsx` — Set Working Hours

```tsx
export default async function AvailabilityPage({ searchParams }) {
  // searchParams = the URL query parameters
  // e.g., if URL is /dashboard/availability?schedule=abc123
  // then searchParams = { schedule: "abc123" }
  
  const activeScheduleId = searchParams.schedule || schedules[0]?.id;
  // If no schedule is selected in the URL, default to the first schedule
  // ?. = optional chaining: if schedules[0] is undefined, don't crash, just return undefined
  
  const sortedAvailabilities = [...availabilities].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  // [...availabilities] = create a copy of the array (don't mutate the original)
  // .sort() = sort in-place. The callback (a, b) => a.dayOfWeek - b.dayOfWeek
  // sorts numerically: 0 (Sunday) first, then 1 (Monday), ..., 6 (Saturday)
  
  // A "hidden" input carries the scheduleId through the form:
  <input type="hidden" name="scheduleId" value={schedule?.id || ""} />
  // The user doesn't see this field, but it gets sent with the form data
  // This tells the server action WHICH schedule to update
  
  // Each availability row has dynamic input names:
  <Input name={`start-${av.id}`} ... />
  // If av.id = "abc123", the input name becomes "start-abc123"
  // In the server action, we read it with: formData.get("start-abc123")
  // This way, a single form can update MULTIPLE availabilities at once
```

---

### `src/app/dashboard/bookings/page.tsx` — View All Bookings

```tsx
const upcoming = bookings.filter(b => b.startTime >= now);
// .filter() creates a NEW array with only items where the condition is true
// >= operator compares Date objects: booking is upcoming if its start time is now or in future

const past = bookings.filter(b => b.startTime < now);
// Past = bookings that already happened

// Reschedule flow:
<a href={`/${b.eventType.slug}/reschedule/${b.id}`}>Reschedule</a>
// This sends the user back to the booking page, but with the OLD booking's ID
// The booking page detects this and, after a new slot is chosen, deletes the old booking
```

---

### `src/app/[slug]/success/page.tsx` — Confirmation Page

```tsx
export default async function SuccessPage({ searchParams }) {
  const { date } = await searchParams;
  // Read the ?date= query parameter from the URL
  // The BookingFlow component put the selected time here after booking
  
  {date && (
    <div>
      {format(parseISO(date as string), "EEEE, MMMM d, yyyy")}
      // parseISO converts an ISO string ("2025-03-29T10:00:00Z") to a Date object
      // format then converts it to "Saturday, March 29, 2025"
    </div>
  )}
```

---

### `src/components/ThemeToggle.tsx` — Light/Dark/System Switch

```tsx
"use client";
// Must run in browser: reads and writes theme preference using localStorage

const { theme, setTheme, resolvedTheme } = useTheme();
// useTheme() = hook from next-themes library
// theme = what the user selected ("light", "dark", or "system")
// setTheme = function to change the theme
// resolvedTheme = what theme is actually showing (if theme="system" and OS is dark, resolvedTheme="dark")

const [mounted, setMounted] = React.useState(false);
React.useEffect(() => setMounted(true), []);
// WHY: During server-side rendering (SSR), the server doesn't know what theme the user
// has selected. If we render theme-dependent UI on the server, and then the browser
// renders it differently, React shows a "hydration error".
// The fix: don't render the toggle at all until the component has "mounted" in the browser.
// React.useEffect(() => ..., []) runs once after the component appears in the DOM.

if (!mounted) {
  return <div className="w-8 h-8 opacity-0" />;
  // Show an invisible placeholder while waiting to mount
  // Same size as the real toggle, so the layout doesn't "jump" when it appears
}

// The three buttons: light (Sun icon), system (Monitor icon), dark (Moon icon)
// The active button gets a highlighted background ring
className={theme === "light" ? "bg-muted ring-1 ring-border" : "text-muted-foreground"}
// Conditional class: if this theme is the currently active one, highlight it
```

---

### `backend/src/index.ts` — The Express.js REST API

```typescript
import express, { Request, Response } from "express";
// express = the framework itself
// Request = TypeScript type for the incoming HTTP request object
// Response = TypeScript type for the outgoing HTTP response object

const app = express();
// Create the Express application instance

app.use(cors());
// app.use() = "apply this middleware to every single request"
// Middleware = a function that runs BEFORE your route handlers
// cors() allows cross-origin requests (frontend on :3000 talking to backend on :5000)

app.use(express.json());
// Another middleware: automatically parse the request body as JSON
// Without this, req.body would be undefined
// With this, req.body = { name: "Alice", email: "alice@example.com" }

const ADMIN_EMAIL = "admin@example.com";
// This app has one hardcoded admin user for the demo
// In a real app, you'd use authentication (JWT tokens, sessions) to know who is logged in

// ── GET /api/event-types ────────────────────────────────
app.get("/api/event-types", async (req: Request, res: Response) => {
  // app.get() = register a handler for HTTP GET requests at this path
  // req = the request object (has req.params, req.body, req.query, req.headers)
  // res = the response object (res.json(), res.status(), res.send())
  
  try {
    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    return res.json(user?.eventTypes ?? []);
    // ?? [] = "if eventTypes is null or undefined, use empty array instead"
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch event types" });
    // 500 = Internal Server Error (something unexpected went wrong on our side)
  }
});

// ── POST /api/bookings ────────────────────────────────
app.post("/api/bookings", async (req: Request, res: Response) => {
  const { name, email, startTime, endTime, eventTypeId, userId, notes, rescheduledFromId } = req.body;
  // Destructuring: extract multiple properties from req.body at once
  
  if (!name || !email || !startTime || !endTime || !eventTypeId || !userId) {
    return res.status(400).json({ error: "Missing required booking fields" });
    // 400 = Bad Request (the CLIENT sent incomplete data)
    // Return early — don't process if required fields are missing
  }
  
  const booking = await prisma.booking.create({
    data: {
      startTime: new Date(startTime),
      // Convert ISO string from the request body to a JavaScript Date object
      // PostgreSQL stores this as a TIMESTAMP WITH TIME ZONE
    }
  });
  
  return res.status(201).json({ id: booking.id });
  // 201 = Created (resource was successfully created)
  // Return only the ID — the frontend uses this to redirect to the success page
});

// ── GET /api/slots/:slug ────────────────────────────────
app.get("/api/slots/:slug", async (req: Request, res: Response) => {
  // :slug is a URL parameter — the actual value is in req.params.slug
  // e.g., GET /api/slots/30-min-meeting → req.params.slug = "30-min-meeting"
  
  const totalSlotMinutes = duration + bufferTime;
  // If meeting is 30 min and buffer is 10 min,
  // we step 40 minutes forward between each slot start time
  
  // Time slot generation algorithm:
  while (current.getTime() + duration * 60000 <= end.getTime()) {
    // Keep generating slots as long as a full-duration meeting fits before end time
    
    const conflict = existingBookings.some(b => {
      return current < new Date(b.endTime) && slotEnd > new Date(b.startTime);
    });
    // .some() = returns true if ANY booking satisfies the condition
    // This is the "overlap check": slot conflicts with a booking if:
    //   slot starts before the booking ends AND slot ends after the booking starts
    
    if (!conflict && current > now) {
      slots.push(current.toISOString());
      // Only add the slot if it's conflict-free AND it's in the future
    }
    
    current = new Date(current.getTime() + totalSlotMinutes * 60000);
    // Move forward to the next slot start time
  }
```

---

## 🔄 PART 5 — DATA FLOW WALKTHROUGH (Step by Step)

### Scenario: User Books a Meeting

```
1. Someone visits: http://localhost:3000/30-min-meeting

2. Next.js server receives this request
   - It matches the [slug] dynamic route
   - slug = "30-min-meeting"

3. page.tsx runs on the server:
   - Queries Prisma: SELECT * FROM EventType WHERE slug = '30-min-meeting'
   - Also fetches: schedules, availabilities, dateOverrides, existing bookings
   - Calls generateAvailableSlots() to compute free time slots for 14 days
   - Returns HTML with these slots embedded as props

4. Browser receives the HTML and renders BookingFlow.tsx
   - Calendar is shown (React component in the browser)
   - User clicks "March 29" → setDate(March 29)
   - React re-renders, shows available slots for that date from slotsByDate["2025-03-29"]

5. User clicks "10:00 AM"
   - setShowConfirm("2025-03-29T10:00:00Z") → the slot splits into label + "Next" button
   
6. User clicks "Next"
   - setSelectedSlot("2025-03-29T10:00:00Z") → UI switches to the booking form

7. User fills in Name + Email + Notes, clicks "Confirm"
   - handleBook() is called
   - Appends startTime, endTime, eventTypeId, userId to FormData
   - Calls createBooking(formData) — a Next.js Server Action

8. createBooking() runs on the server:
   - Reads all fields from FormData
   - Logs a simulated confirmation email to console
   - Calls prisma.booking.create() → INSERT INTO Booking (...) VALUES (...)
   - Returns the new booking.id

9. Back in the browser, handleBook() gets the bookingId
   - router.push("/30-min-meeting/success?date=2025-03-29T10:00:00Z")
   - Browser navigates to the success page

10. Success page loads, reads the ?date= query param
    - Displays "Saturday, March 29, 2025" and "10:00 AM"
    - Shows a "Return to Dashboard" button
```

---

## ⚠️ PART 6 — IMPORTANT CONCEPTS TO UNDERSTAND

### Server Components vs Client Components

| | Server Component | Client Component |
|---|---|---|
| **Where it runs** | On the server (Node.js) | In the browser (JavaScript) |
| **Can access database?** | ✅ Yes | ❌ No |
| **Can use useState?** | ❌ No | ✅ Yes |
| **Can use onClick?** | ❌ No | ✅ Yes |
| **Default in Next.js?** | ✅ Yes | Must add `"use client"` |

**Rule of thumb:** Use server components to LOAD data. Use client components for INTERACTIVITY.

---

### HTTP Status Codes (Used in Express)

| Code | Name | When to use |
|------|------|-------------|
| 200 | OK | Request succeeded (default for `res.json()`) |
| 201 | Created | New resource was successfully created |
| 400 | Bad Request | Client sent invalid/missing data |
| 404 | Not Found | The requested resource doesn't exist |
| 409 | Conflict | Duplicate — e.g., slug already taken |
| 500 | Server Error | Something unexpected went wrong |

---

### REST API Conventions (Used in Express)

| Method | Action | Example |
|--------|--------|---------|
| `GET` | Read data | `GET /api/bookings` |
| `POST` | Create data | `POST /api/bookings` |
| `PUT` | Replace data fully | `PUT /api/event-types/:id` |
| `PATCH` | Update part of data | `PATCH /api/event-types/:id/toggle` |
| `DELETE` | Remove data | `DELETE /api/bookings/:id` |

---

### Async / Await Explanation

```typescript
// Without async/await (callback hell):
prisma.booking.findMany({}).then(bookings => {
  prisma.eventType.findMany({}).then(events => {
    // deeply nested, hard to read
  });
});

// With async/await (clean and readable):
async function getData() {
  const bookings = await prisma.booking.findMany({});
  // "pause here, wait for the database, then continue"
  const events = await prisma.eventType.findMany({});
  // "pause here again, then continue"
  return { bookings, events };
}
// Reads top-to-bottom like normal synchronous code
```

---

## 🗂️ PART 7 — HOW TO RUN THE PROJECT

### Step 1: Install Dependencies
```bash
# Frontend
cd cal-clone
npm install

# Backend
cd backend
npm install
```

### Step 2: Set Up PostgreSQL Database

Get a free database from [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com) — both are free.

Copy the connection string and update `backend/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
PORT=5000
```

### Step 3: Create the Database Tables
```bash
cd backend
npx prisma db push
# Prisma reads schema.prisma and creates all the tables in PostgreSQL
```

### Step 4: Start Both Servers

**Terminal 1 (Frontend):**
```bash
cd cal-clone
npm run dev
# Runs at http://localhost:3000
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
# Runs at http://localhost:5000
```

---

*This document explains every part of the Cal.com Clone project in full depth — from the big picture architecture down to individual lines of code. The goal is that after reading this, you could rebuild the entire project from scratch.*
