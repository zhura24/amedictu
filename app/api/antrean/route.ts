export const dynamic = 'force-dynamic';

// app/api/antrean/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const { session, error } = await requireAuth(["admin", "tenaga_medis", "pasien"]);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const poliId = searchParams.get("id_poli");

    const conn = await pool.getConnection();
    try {
      let query = `
        SELECT a.*, p.nama_depan, p.nama_belakang, po.nama_poli 
        FROM antrian a 
        JOIN pasien p ON a.id_pasien = p.id_pasien 
        JOIN poli po ON a.id_poli = po.id_poli
      `;
      const params = [];

      if (poliId) {
        query += " WHERE a.id_poli = ?";
        params.push(poliId);
      } else if (session.user.role === "pasien") {
        query += " WHERE a.id_pasien = ?";
        params.push(session.user.id_pasien);
      } else if (session.user.role === "tenaga_medis" && session.user.id_poli) {
        query += " WHERE a.id_poli = ?";
        params.push(session.user.id_poli);
      }

      query += " ORDER BY a.tanggal DESC, a.nomor_antrian ASC";

      const [rows] = await conn.query(query, params);
      return apiSuccess(rows);
    } finally {
      conn.release();
    }
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { session, error } = await requireAuth(["pasien"]);
    if (error) return error;

    const body = await req.json();
    const { id_poli, keluhan, tanggal } = body;

    if (!id_poli) return apiError("Poli tujuan wajib dipilih");

    const conn = await pool.getConnection();
    try {
      // 1. Dapatkan nomor antrian berikutnya untuk hari & poli ini
      const [rows]: any = await conn.query(
        "SELECT MAX(nomor_antrian) as max_no FROM antrian WHERE id_poli = ? AND tanggal = ?",
        [id_poli, tanggal || new Date()]
      );
      const nextNo = (rows[0].max_no || 0) + 1;

      // 2. Insert antrian
      const [result]: any = await conn.query(
        "INSERT INTO antrian (nomor_antrian, tanggal, keluhan, status, id_pasien, id_poli) VALUES (?, ?, ?, 'menunggu', ?, ?)",
        [nextNo, tanggal || new Date(), keluhan || "", session.user.id_pasien, id_poli]
      );

      return apiSuccess({ id_antrian: result.insertId, nomor_antrian: nextNo }, "Antrean berhasil diambil");
    } finally {
      conn.release();
    }
  });
}
