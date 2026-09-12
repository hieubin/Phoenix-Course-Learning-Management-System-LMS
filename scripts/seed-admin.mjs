import 'dotenv/config';
import bcrypt from 'bcrypt';
import prisma from '../experiments/day8/lib/prisma.js';

const adminEmail = 'admin@lab.local';
const adminPassword = 'LabAdmin2026!';

try {
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      name: 'Lab Admin',
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Admin ready: ${adminEmail}`);
} finally {
  await prisma.$disconnect();
}