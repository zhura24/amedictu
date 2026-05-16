// app/api/antrean/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, apiSuccess, apiError, withErrorHandler } from "@/lib/api-helpers";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return withErrorHandler(async () => {
    const { session, error } = await requireAuth(["admin", "tenaga_medis", "pasien"]);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const poliIdParam = searchParams.get("id_poli");

    let where: any = {};

    // Filter berdasarkan role
    if (session.user.role === "pasien") {
      where.id_pasien = session.user.id_pasien;
    } else if (session.user.role === "tenaga_medis") {
      // DOKTER HANYA LIHAT POLI MEREKA SENDIRI
      if (session.user.id_poli) {
        where.id_poli = session.user.id_poli;
      } else {
        return apiError("Akses ditolak: Anda tidak ditugaskan ke poli manapun.", 403);
      }
    } else if (session.user.role === "admin" && poliIdParam) {
      where.id_poli = parseInt(poliIdParam);
    }

    const rows = await prisma.antrian.findMany({
      where,
      include: {
        pasien: true,
        poli: true
      },
      orderBy: [
        { tanggal: 'desc' },
        { nomor_antrian: 'asc' }
      ]
    });

    // Format data agar sesuai UI
    const formatted = rows.map(r => ({
      ...r,
      nama_pasien: `${r.pasien.nama_depan} ${r.pasien.nama_belakang}`,
      nama_poli: r.poli.nama_poli
    }));

    return apiSuccess(formatted);
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const { session, error } = await requireAuth(["pasien"]);
    if (error) return error;

    const body = await req.json();
    const { id_poli, keluhan, tanggal } = body;

    if (!id_poli) return apiError("Poli tujuan wajib dipilih");

    const tgl = tanggal ? new Date(tanggal) : new Date();
    tgl.setHours(0, 0, 0, 0);

    // 1. Cari nomor antrian terakhir
    const lastAntrian = await prisma.antrian.findFirst({
      where: {
        id_poli: parseInt(id_poli),
        tanggal: tgl
      },
      orderBy: { nomor_antrian: 'desc' }
    });

    const nextNo = (lastAntrian?.nomor_antrian || 0) + 1;

    // 2. Buat antrian baru
    const newAntrian = await prisma.antrian.create({
      data: {
        nomor_antrian: nextNo,
        tanggal: tgl,
        keluhan: keluhan || "",
        id_pasien: session.user.id_pasien as number,
        id_poli: parseInt(id_poli)
      }
    });


    return apiSuccess({ id_antrian: newAntrian.id_antrian, nomor_antrian: nextNo }, "Antrean berhasil diambil");
  });
}

