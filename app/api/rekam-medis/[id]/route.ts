// app/api/rekam-medis/[id]/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth();
    if (error) return error;
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query<any[]>("SELECT * FROM rekam_medis WHERE id_rekam_medis = ?", [params.id]);
      if (!rows[0]) return apiError("Rekam medis tidak ditemukan", 404);
      return apiSuccess(rows[0]);
    } finally { conn.release(); }
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["tenaga_medis", "admin"]);
    if (error) return error;
    const body = await req.json();
    const { keluhan, diagnosa, tindakan, catatan, tanggal_periksa } = body;
    const conn = await pool.getConnection();
    try {
      await conn.query(
        "UPDATE rekam_medis SET keluhan=?, diagnosa=?, tindakan=?, catatan=?, tanggal_periksa=?, updatedAt=NOW() WHERE id_rekam_medis=?",
        [keluhan, diagnosa || null, tindakan || null, catatan || null, tanggal_periksa, params.id]
      );
      return apiSuccess(null, "Rekam medis berhasil diperbarui");
    } finally { conn.release(); }
  });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["admin"]);
    if (error) return error;
    const conn = await pool.getConnection();
    try {
      await conn.query("DELETE FROM rekam_medis WHERE id_rekam_medis = ?", [params.id]);
      return apiSuccess(null, "Rekam medis berhasil dihapus");
    } finally { conn.release(); }
  });
}
