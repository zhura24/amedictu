export const dynamic = 'force-dynamic';

// app/api/antrean/[id]/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["admin", "tenaga_medis"]);
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const { status, rekam_medis } = body;

    if (!["menunggu", "dipanggil", "selesai", "dibatalkan"].includes(status)) {
      return apiError("Status tidak valid");
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Update status antrian
      await conn.query(
        "UPDATE antrian SET status = ? WHERE id_antrian = ?",
        [status, id]
      );

      // Jika selesai dan ada data rekam medis, simpan ke tabel rekam_medis
      if (status === "selesai" && rekam_medis) {
        // Ambil id_pasien dari antrian
        const [rows]: any = await conn.query(
          "SELECT id_pasien, keluhan FROM antrian WHERE id_antrian = ?",
          [id]
        );
        
        if (rows.length > 0) {
          const { id_pasien, keluhan } = rows[0];
          await conn.query(
            `INSERT INTO rekam_medis (
              id_pasien, tanggal_periksa, keluhan, diagnosa, resep_obat, aturan_minum, createdAt, updatedAt
            ) VALUES (?, CURDATE(), ?, ?, ?, ?, NOW(), NOW())`,
            [
              id_pasien, 
              keluhan || "", 
              rekam_medis.diagnosa || "", 
              rekam_medis.resep_obat || "", 
              rekam_medis.aturan_minum || ""
            ]
          );
        }
      }

      await conn.commit();
      return apiSuccess(null, `Antrean berhasil diperbarui`);
    } catch (err: any) {
      await conn.rollback();
      return apiError(err.message);
    } finally {
      conn.release();
    }

  });
}
