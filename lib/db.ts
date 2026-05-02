// lib/db.ts
// Koneksi MySQL langsung untuk API routes (lebih stabil di Prisma v7)
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "amedictu_db",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
