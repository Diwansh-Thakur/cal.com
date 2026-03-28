import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...');

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Demo User',
      timezone: 'Asia/Kolkata'
    },
  });
  console.log(`✅ User: ${user.name} (${user.email})`);

  let schedule = await prisma.schedule.findFirst({ where: { userId: user.id } });
  if (!schedule) {
    schedule = await prisma.schedule.create({
      data: { name: 'Working Hours', userId: user.id }
    });
  }

  // Mon–Fri, 9 AM – 5 PM
  for (let i = 1; i <= 5; i++) {
    await prisma.availability.upsert({
      where: { scheduleId_dayOfWeek: { scheduleId: schedule.id, dayOfWeek: i } },
      update: {},
      create: { dayOfWeek: i, startTime: '09:00', endTime: '17:00', scheduleId: schedule.id }
    });
  }
  console.log('✅ Mon–Fri 9 AM–5 PM availability set');

  const events = [
    { title: '30 Min Meeting', slug: '30-min-meeting', duration: 30, bufferTime: 5, description: 'A quick 30-minute catch-up or intro call. Perfect for a first meeting.' },
    { title: '1 Hour Consultation', slug: '1-hour-consultation', duration: 60, bufferTime: 10, description: 'An in-depth 1-hour consultation for detailed discussions and planning.' },
    { title: '15 Min Quick Chat', slug: '15-min-quick-chat', duration: 15, bufferTime: 0, description: 'A fast 15-minute sync to align on quick questions.' },
  ];

  for (const event of events) {
    await prisma.eventType.upsert({
      where: { slug: event.slug },
      update: {},
      create: { ...event, userId: user.id, scheduleId: schedule.id }
    });
    console.log(`✅ Event: ${event.title}`);
  }

  console.log('\n🎉 Seeding complete!');
  console.log('   Dashboard → /dashboard');
  console.log('   Book a meeting → /30-min-meeting\n');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect())
