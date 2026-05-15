"use client";

import { useState, useEffect } from "react";
import styles from "../../../components/UI.module.css";

type StatusAntrian = "menunggu" | "dipanggil" | "selesai" | "dibatalkan";

interface Antrean {
  id_antrian: number;
  nomor_antrian: number;
  nama_depan: string;
  nama_belakang: string;
  keluhan: string;
  status: StatusAntrian;
  nama_poli: string;
}

export default function KelolaAntrean() {
  const [antreanList, setAntreanList] = useState<Antrean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAntrean = async () => {
    try {
      const res = await fetch("/api/antrean");
      const data = await res.json();
      if (data.success) {
        setAntreanList(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat antrean");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: StatusAntrian) => {
    try {
      const res = await fetch(`/api/antrean/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchAntrean();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  const getStatusBadge = (status: StatusAntrian) => {
    switch(status) {
      case "menunggu": return <span className={`${styles.badge} ${styles.badgeMenunggu}`}>Menunggu</span>;
      case "dipanggil": return <span className={`${styles.badge}`} style={{ backgroundColor: '#bee3f8', color: '#2b6cb0' }}>Sedang Diperiksa</span>;
      case "selesai": return <span className={`${styles.badge} ${styles.badgeAktif}`}>Selesai</span>;
      case "dibatalkan": return <span className={`${styles.badge}`} style={{ backgroundColor: '#fed7d7', color: '#c53030' }}>Dibatalkan</span>;
      default: return null;
    }
  };

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data antrean...</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Kelola Antrean</h1>
        <p className={styles.subtitle}>Panggil pasien dan kelola status antrean secara real-time.</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No. Antrean</th>
              <th>Nama Pasien</th>
              <th>Poli</th>
              <th>Keluhan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {antreanList.map((antrean) => (
              <tr key={antrean.id_antrian} style={{ opacity: antrean.status === 'selesai' ? 0.6 : 1 }}>
                <td><strong style={{ color: antrean.status === 'selesai' ? 'var(--text-muted)' : 'var(--primary)', fontSize: '1.2rem' }}>A-{String(antrean.nomor_antrian).padStart(3, '0')}</strong></td>
                <td>{antrean.nama_depan} {antrean.nama_belakang}</td>
                <td>{antrean.nama_poli}</td>
                <td>{antrean.keluhan || "-"}</td>
                <td>{getStatusBadge(antrean.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {antrean.status === "menunggu" && (
                      <button onClick={() => handleUpdateStatus(antrean.id_antrian, "dipanggil")} className={styles.button} style={{ backgroundColor: '#3182ce' }}>Panggil</button>
                    )}
                    {antrean.status === "dipanggil" && (
                      <button onClick={() => handleUpdateStatus(antrean.id_antrian, "selesai")} className={styles.button} style={{ backgroundColor: 'var(--success)' }}>Selesai</button>
                    )}
                    {antrean.status === "selesai" && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Telah Selesai</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {antreanList.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Belum ada antrean masuk.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

