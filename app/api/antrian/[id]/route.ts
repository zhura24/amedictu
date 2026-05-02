// app/api/antrian/[id]/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  return withErrorHandler(async () => {
    const { session, error } = await requireAuth();
    if (error) return error;

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query<any[]>(
        `SELECT a.*, CONCAT(p.nama_depan, ' ', p.nama_belakang) as nama_pasien
         FROM antrian a JOIN pasien p ON a.id_pasien = p.id_pasien
         WHERE a.id_antrian = ?`,
        [params.id]
      );
      if (!rows[0]) return apiError("Antrian tidak ditemukan", 404);
      return apiSuccess(rows[0]);
    } finally {
      conn.release();
    }
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  return withErrorHandler(async () => {
    const { session, error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { status } = body;
    const validStatus = ["dipanggil", "selesai", "dibatalkan"];
    if (!validStatus.includes(status)) return apiError("Status tidak valid");

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query<any[]>("SELECT * FROM antrian WHERE id_antrian = ?", [params.id]);
      if (!rows[0]) return apiError("Antrian tidak ditemukan", 404);

      await conn.query("UPDATE antrian SET status = ? WHERE id_antrian = ?", [status, params.id]);
      return apiSuccess({ id_antrian: params.id, status }, `Status berhasil diubah ke ${status}`);
    } finally {
      conn.release();
    }
  });
}
