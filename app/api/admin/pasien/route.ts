// app/api/admin/pasien/route.ts
import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const { error } = await requireAuth(["admin", "tenaga_medis"]);
    if (error) return error;

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(`
        SELECT id_pasien, nama_depan, nama_belakang, jenis_kelamin, tanggal_lahir, no_telp, alamat 
        FROM pasien 
        ORDER BY createdAt DESC
      `);
      
      // Format data agar sesuai dengan UI yang mengharapkan field tertentu
      const formatted = (rows as any[]).map(p => ({
        id: p.id_pasien,
        no_rekam_medis: `RM-${String(p.id_pasien).padStart(6, '0')}`,
        nama: `${p.nama_depan} ${p.nama_belakang}`,
        jenis_kelamin: p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
        tgl_lahir: new Date(p.tanggal_lahir).toLocaleDateString('id-ID'),
        no_telp: p.no_telp,
        alamat: p.alamat
      }));

      return apiSuccess(formatted);
    } finally {
      conn.release();
    }
  });
}

export async function PUT(req: NextRequest) {
    return withErrorHandler(async () => {
      const { error: authError } = await requireAuth(["admin", "tenaga_medis"]);
      if (authError) return authError;
  
      const body = await req.json();
      const { id, nama, jenis_kelamin, tgl_lahir, no_telp } = body;
  
      if (!id) return apiError("ID Pasien diperlukan", 400);
  
      const conn = await pool.getConnection();
      try {
        // Pecah nama kembali (simpel: kata pertama adalah depan, sisanya belakang)
        const nameParts = nama.split(' ');
        const nama_depan = nameParts[0];
        const nama_belakang = nameParts.slice(1).join(' ') || "";
        const jk = jenis_kelamin === 'Laki-laki' ? 'L' : 'P';
  
        await conn.query(
          "UPDATE pasien SET nama_depan = ?, nama_belakang = ?, jenis_kelamin = ?, no_telp = ? WHERE id_pasien = ?",
          [nama_depan, nama_belakang, jk, no_telp, id]
        );
  
        return apiSuccess({ message: "Data pasien diperbarui" });
      } finally {
        conn.release();
      }
    });
  }
