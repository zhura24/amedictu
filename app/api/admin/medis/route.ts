// app/api/admin/medis/route.ts
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["admin"]);
    if (error) return error;

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        `SELECT u.id_user, u.username, u.role, u.createdAt, p.nama_poli 
         FROM users u 
         LEFT JOIN poli p ON u.id_poli = p.id_poli
         WHERE u.role = 'tenaga_medis' 
         ORDER BY u.createdAt DESC`
      );
      return apiSuccess(rows);
    } finally {
      conn.release();
    }
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["admin"]);
    if (error) return error;

    const body = await req.json();
    const { username, password, id_poli } = body;

    if (!username || !password || !id_poli) {
      return apiError("Username, password, dan Poli wajib diisi");
    }

    if (password.length < 6) {
      return apiError("Password minimal 6 karakter");
    }

    const conn = await pool.getConnection();
    try {
      // Cek apakah username sudah ada
      const [existing] = await conn.query<any[]>(
        "SELECT id_user FROM users WHERE username = ?",
        [username]
      );

      if (existing.length > 0) {
        return apiError("Username sudah digunakan", 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await conn.query(
        "INSERT INTO users (username, password, role, id_poli, createdAt, updatedAt) VALUES (?, ?, 'tenaga_medis', ?, NOW(), NOW())",
        [username, hashedPassword, id_poli]
      );

      return apiSuccess(null, "Akun tenaga medis berhasil dibuat", 201);
    } finally {
      conn.release();
    }
  });
}

