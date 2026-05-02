import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://root:@localhost:3306/amedictu_db",
    },
  },
});

async function main() {
  console.log("Mulai seeding...");

  await prisma.notifikasi.deleteMany();
  await prisma.rekamMedis.deleteMany();
  await prisma.antrian.deleteMany();
  await prisma.pasien.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({ data: { username: "admin", password: adminPassword, role: "admin" } });
  console.log("Akun admin dibuat");

  const dokterPassword = await bcrypt.hash("dokter123", 10);
  await prisma.user.create({ data: { username: "dr.sari", password: dokterPassword, role: "tenaga_medis" } });
  console.log("Akun dokter dibuat");

  const pasienPassword = await bcrypt.hash("pasien123", 10);
  await prisma.user.create({ data: { username: "budi_santoso", password: pasienPassword, role: "pasien", pasien: { create: { nama_depan: "Budi", nama_belakang: "Santoso", no_telp: "081234567890" } } } });
  console.log("Akun pasien dibuat");

  console.log("Seeding selesai!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
