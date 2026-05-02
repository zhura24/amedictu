// app/api/laporan/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["admin", "tenaga_medis"]);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const periode = searchParams.get("periode") || "hari_ini";

    const today = new Date().toISOString().split("T")[0];
    let dateFrom = today, dateTo = today;

    if (periode === "minggu_ini") {
      const d = new Date(); d.setDate(d.getDate() - 7);
      dateFrom = d.toISOString().split("T")[0];
    } else if (periode === "bulan_ini") {
      const d = new Date();
      dateFrom = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
    } else if (periode === "custom") {
      dateFrom = searchParams.get("tgl_mulai") || today;
      dateTo = searchParams.get("tgl_akhir") || today;
    }

    const conn = await pool.getConnection();
    try {
      const [total] = await conn.query<any[]>("SELECT COUNT(*) as total FROM antrian WHERE DATE(tanggal) BETWEEN ? AND ?", [dateFrom, dateTo]);
      const [selesai] = await conn.query<any[]>("SELECT COUNT(*) as total FROM antrian WHERE DATE(tanggal) BETWEEN ? AND ? AND status='selesai'", [dateFrom, dateTo]);
      const [menunggu] = await conn.query<any[]>("SELECT COUNT(*) as total FROM antrian WHERE DATE(tanggal) BETWEEN ? AND ? AND status='menunggu'", [dateFrom, dateTo]);
      const [perPoli] = await conn.query<any[]>("SELECT poli, COUNT(*) as jumlah FROM antrian WHERE DATE(tanggal) BETWEEN ? AND ? GROUP BY poli ORDER BY jumlah DESC", [dateFrom, dateTo]);
      const [totalPasien] = await conn.query<any[]>("SELECT COUNT(*) as total FROM pasien", []);

      return apiSuccess({
        periode: { jenis: periode, dari: dateFrom, sampai: dateTo },
        antrian: { total: total[0].total, selesai: selesai[0].total, menunggu: menunggu[0].total, per_poli: perPoli },
        pasien: { total_terdaftar: totalPasien[0].total },
      });
    } finally {
      conn.release();
    }
  });
}
