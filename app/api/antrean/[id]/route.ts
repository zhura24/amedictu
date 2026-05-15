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
    const { status } = body;

    if (!["menunggu", "dipanggil", "selesai", "dibatalkan"].includes(status)) {
      return apiError("Status tidak valid");
    }

    const conn = await pool.getConnection();
    try {
      await conn.query(
        "UPDATE antrian SET status = ? WHERE id_antrian = ?",
        [status, id]
      );
      return apiSuccess(null, `Status antrean berhasil diubah menjadi ${status}`);
    } finally {
      conn.release();
    }
  });
}
