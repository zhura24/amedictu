// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaMysql } from "@prisma/adapter-mysql";
import mysql from "mysql2";

const pool = mysql.createPool(process.env.DATABASE_URL as string);
const adapter = new PrismaMysql(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
