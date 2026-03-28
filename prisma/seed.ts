import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Default Admin',
      timezone: 'UTC'
    },
  })

  let schedule = await prisma.schedule.findFirst({ where: { userId: user.id } });
  if (!schedule) {
    schedule = await prisma.schedule.create({
      data: { name: 'Standard Working Hours', userId: user.id }
    })
  }

  for (let i = 1; i <= 5; i++) {
    await prisma.availability.upsert({
      where: {
        scheduleId_dayOfWeek: { scheduleId: schedule.id, dayOfWeek: i }
      },
      update: {},
      create: {
        dayOfWeek: i,
        startTime: '09:00',
        endTime: '17:00',
        scheduleId: schedule.id
      }
    })
  }

  await prisma.eventType.upsert({
    where: { slug: '30-min-meeting' },
    update: {},
    create: {
      title: '30 Min Meeting',
      slug: '30-min-meeting',
      duration: 30,
      bufferTime: 5,
      description: 'A quick 30-minute sync.',
      userId: user.id,
      scheduleId: schedule.id
    }
  })

  console.log('Database seeded!')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect())
