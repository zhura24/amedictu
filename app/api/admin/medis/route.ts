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
        "SELECT id_user, username, role, createdAt FROM users WHERE role = 'tenaga_medis' ORDER BY createdAt DESC"
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
    const { username, password } = body;

    if (!username || !password) {
      return apiError("Username dan password wajib diisi");
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
        "INSERT INTO users (username, password, role, createdAt, updatedAt) VALUES (?, ?, 'tenaga_medis', NOW(), NOW())",
        [username, hashedPassword]
      );

      return apiSuccess(null, "Akun tenaga medis berhasil dibuat", 201);
    } finally {
      conn.release();
    }
  });
}
