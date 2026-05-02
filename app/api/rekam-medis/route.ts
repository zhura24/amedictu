// app/api/rekam-medis/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const id_pasien = session!.user.role === "pasien" ? session!.user.id_pasien : searchParams.get("id_pasien");
    if (!id_pasien) return apiError("id_pasien wajib disertakan");

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query<any[]>(
        `SELECT r.*, CONCAT(p.nama_depan, ' ', p.nama_belakang) as nama_pasien, p.no_rekam_medis
         FROM rekam_medis r JOIN pasien p ON r.id_pasien = p.id_pasien
         WHERE r.id_pasien = ? ORDER BY r.tanggal_periksa DESC`,
        [id_pasien]
      );
      return apiSuccess(rows);
    } finally {
      conn.release();
    }
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["tenaga_medis", "admin"]);
    if (error) return error;

    const body = await req.json();
    const { id_pasien, keluhan, diagnosa, tindakan, catatan, tanggal_periksa } = body;
    if (!id_pasien || !keluhan) return apiError("id_pasien dan keluhan wajib diisi");

    const conn = await pool.getConnection();
    try {
      const tgl = tanggal_periksa || new Date().toISOString().split("T")[0];
      await conn.query(
        "INSERT INTO rekam_medis (id_pasien, keluhan, diagnosa, tindakan, catatan, tanggal_periksa, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [id_pasien, keluhan, diagnosa || null, tindakan || null, catatan || null, tgl]
      );
      return apiSuccess(null, "Rekam medis berhasil ditambahkan", 201);
    } finally {
      conn.release();
    }
  });
}
