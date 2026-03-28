# 🗓️ Cal.com Clone

A modern, open-source scheduling and booking application built to replicate the core experience of Cal.com. This robust MVP makes it easier for individuals and teams to manage their availability and effortlessly schedule meetings.

## ✨ Features

- **Public Booking Flow:** A seamless, conflict-free interface for users to book meetings.
- **Dynamic Event Types:** Create, edit, and manage different types of meetings (15m, 30m, video call, etc.).
- **Availability Management:** Set up customized working hours to prevent double-booking.
- **Bookings Dashboard:** A centralized place to view and manage all upcoming appointments.
- **Modern & Premium UI:** Built with Tailwind CSS and Shadcn UI, featuring fluid animations, glassmorphism, and a polished aesthetic.
- **Theme-Aware:** Built-in seamless support for light, dark, and system color themes.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Language:** TypeScript

## 🚀 Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, yarn, or bun installed

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Diwansh-Thakur/Clone-Cal.com.git
   cd cal-clone
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory and configure your database connection string:
   ```env
   DATABASE_URL="file:./dev.db"  # Example for SQLite
   ```

4. Run database migrations
   ```bash
   npx prisma db push
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---
Built with ❤️ for scheduling made simple.
