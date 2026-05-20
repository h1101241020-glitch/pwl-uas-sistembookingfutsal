// prisma/seed.ts
// Data awal untuk development & testing

import { PrismaClient, Role, SurfaceType, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database...");

  // ── Hapus data lama ──────────────────────────────────
  await prisma.booking.deleteMany();
  await prisma.fieldImage.deleteMany();
  await prisma.field.deleteMany();
  await prisma.operatingHour.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 10);

  const owner = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "owner@futsal.com",
      phone: "081234567890",
      passwordHash,
      role: Role.owner,
    },
  });

  const player = await prisma.user.create({
    data: {
      name: "Andi Wijaya",
      email: "player@futsal.com",
      phone: "082345678901",
      passwordHash,
      role: Role.player,
    },
  });

  console.log("✅ Users dibuat:", owner.email, player.email);

  // ── Venue ─────────────────────────────────────────────
  const venue = await prisma.venue.create({
    data: {
      ownerId: owner.id,
      name: "Futsal Arena Pontianak",
      description: "Lapangan futsal indoor berkualitas tinggi di pusat kota Pontianak. Tersedia 2 lapangan dengan permukaan vinyl dan parquet.",
      address: "Jl. Ahmad Yani No. 123, Pontianak Selatan",
      latitude: -0.0236,
      longitude: 109.3425,
      city: "Pontianak",
      isActive: true,
    },
  });

  console.log("✅ Venue dibuat:", venue.name);

  // ── Operating Hours (Senin - Minggu) ──────────────────
  const days = [
    { dayOfWeek: 0, open: "08:00", close: "22:00" }, // Minggu
    { dayOfWeek: 1, open: "07:00", close: "23:00" }, // Senin
    { dayOfWeek: 2, open: "07:00", close: "23:00" }, // Selasa
    { dayOfWeek: 3, open: "07:00", close: "23:00" }, // Rabu
    { dayOfWeek: 4, open: "07:00", close: "23:00" }, // Kamis
    { dayOfWeek: 5, open: "07:00", close: "24:00" }, // Jumat
    { dayOfWeek: 6, open: "07:00", close: "24:00" }, // Sabtu
  ];

  for (const day of days) {
    const [oh, om] = day.open.split(":").map(Number);
    const [ch, cm] = day.close.split(":").map(Number);
    const baseDate = new Date("1970-01-01");
    await prisma.operatingHour.create({
      data: {
        venueId: venue.id,
        dayOfWeek: day.dayOfWeek,
        openTime: new Date(baseDate.setHours(oh, om, 0, 0)),
        closeTime: new Date(new Date("1970-01-01").setHours(ch === 24 ? 23 : ch, ch === 24 ? 59 : cm, 0, 0)),
      },
    });
  }

  console.log("✅ Operating hours dibuat");

  // ── Fields ────────────────────────────────────────────
  const fieldA = await prisma.field.create({
    data: {
      venueId: venue.id,
      name: "Lapangan A",
      surfaceType: SurfaceType.vinyl,
      pricePerHour: 100000,
      isActive: true,
    },
  });

  const fieldB = await prisma.field.create({
    data: {
      venueId: venue.id,
      name: "Lapangan B",
      surfaceType: SurfaceType.parquet,
      pricePerHour: 120000,
      isActive: true,
    },
  });

  console.log("✅ Fields dibuat:", fieldA.name, fieldB.name);

  // ── Field Images (placeholder) ────────────────────────
  await prisma.fieldImage.createMany({
    data: [
      {
        fieldId: fieldA.id,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/futsal-a-1.jpg",
        isPrimary: true,
      },
      {
        fieldId: fieldA.id,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/futsal-a-2.jpg",
        isPrimary: false,
      },
      {
        fieldId: fieldB.id,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/futsal-b-1.jpg",
        isPrimary: true,
      },
    ],
  });

  // ── Sample Booking ────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.booking.create({
    data: {
      fieldId: fieldA.id,
      userId: player.id,
      bookingDate: tomorrow,
      startTime: new Date(new Date("1970-01-01").setHours(10, 0, 0, 0)),
      endTime: new Date(new Date("1970-01-01").setHours(11, 0, 0, 0)),
      totalPrice: 100000,
      status: BookingStatus.confirmed,
    },
  });

  console.log("✅ Sample booking dibuat");
  console.log("\n🎉 Seeding selesai!");
  console.log("\n📋 Akun test:");
  console.log("   Owner  → owner@futsal.com / password123");
  console.log("   Player → player@futsal.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
