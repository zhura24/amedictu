// app/api/jadwal-dokter/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM jadwal_dokter ORDER BY FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'), jam_mulai ASC"
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
    const { nama_dokter, spesialis, hari, jam_mulai, jam_selesai } = body;

    if (!nama_dokter || !hari || !jam_mulai || !jam_selesai) {
      return apiError("Data jadwal tidak lengkap");
    }

    const conn = await pool.getConnection();
    try {
      await conn.query(
        "INSERT INTO jadwal_dokter (nama_dokter, spesialis, hari, jam_mulai, jam_selesai) VALUES (?, ?, ?, ?, ?)",
        [nama_dokter, spesialis || "Dokter Umum", hari, jam_mulai, jam_selesai]
      );
      return apiSuccess(null, "Jadwal berhasil ditambahkan", 201);
    } finally {
      conn.release();
    }
  });
}
