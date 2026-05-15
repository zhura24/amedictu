"use client";

import { useState, useEffect } from "react";
import styles from "../../../components/UI.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function MedisDashboard() {
  const [antreanList, setAntreanList] = useState<Antrean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    // Refresh setiap 30 detik
    const interval = setInterval(fetchAntrean, 30000);
    return () => clearInterval(interval);
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
        fetchAntrean(); // Refresh data
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

  const totalPasien = antreanList.length;
  const menunggu = antreanList.filter(a => a.status === 'menunggu' || a.status === 'dipanggil').length;
  const selesai = antreanList.filter(a => a.status === 'selesai').length;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Tenaga Medis</h1>
        <p className={styles.subtitle}>Ringkasan antrean dan pasien hari ini.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Pasien</h3>
          </div>
          <div className={styles.statValue}>{totalPasien}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Sedang Menunggu</h3>
            <span className={`${styles.badge} ${styles.badgeMenunggu}`}>Antre</span>
          </div>
          <div className={styles.statValue}>{menunggu}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Selesai Diperiksa</h3>
            <span className={`${styles.badge} ${styles.badgeAktif}`}>Selesai</span>
          </div>
          <div className={styles.statValue}>{selesai}</div>
        </div>
      </div>

      <div className={styles.header} style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
        <h2 className={styles.title} style={{ fontSize: '1.5rem' }}>Daftar Antrean Real-time</h2>
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
                    {antrean.status === 'menunggu' && (
                      <button onClick={() => handleUpdateStatus(antrean.id_antrian, "dipanggil")} className={styles.button} style={{ backgroundColor: '#3182ce' }}>Panggil</button>
                    )}
                    {antrean.status === 'dipanggil' && (
                      <button onClick={() => handleUpdateStatus(antrean.id_antrian, "selesai")} className={styles.button} style={{ backgroundColor: 'var(--success)' }}>Selesai</button>
                    )}
                    {antrean.status === 'selesai' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selesai diperiksa</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {antreanList.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Belum ada antrean hari ini.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

