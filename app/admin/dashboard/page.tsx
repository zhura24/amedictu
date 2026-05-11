"use client";

import { useState, useEffect } from "react";
import styles from "../../../components/UI.module.css";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalPasien: 1245, tenagaMedis: 12, kunjunganHariIni: 84 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Count Kunjungan & Pasien
    const savedAntrean = localStorage.getItem('antreanList');
    if (savedAntrean) {
      const parsed = JSON.parse(savedAntrean);
      setStats(prev => ({ ...prev, kunjunganHariIni: parsed.length, totalPasien: parsed.length }));
    } else {
      setStats(prev => ({ ...prev, kunjunganHariIni: 3, totalPasien: 3 }));
    }

    // Count Tenaga Medis
    const savedDokter = localStorage.getItem('jadwalDokter');
    if (savedDokter) {
      const parsedDokter = JSON.parse(savedDokter);
      setStats(prev => ({ ...prev, tenagaMedis: parsedDokter.length }));
    } else {
      setStats(prev => ({ ...prev, tenagaMedis: 6 })); // Default is 6
    }
  }, []);

  if (!isClient) return null;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Admin</h1>
        <p className={styles.subtitle}>Ringkasan operasional dan statistik klinik AMEDICTU.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Pasien Terdaftar</h3>
          </div>
          <div className={styles.statValue}>{stats.totalPasien}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Tenaga Medis Aktif</h3>
          </div>
          <div className={styles.statValue}>{stats.tenagaMedis}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Kunjungan Hari Ini</h3>
            <span className={`${styles.badge} ${styles.badgeAktif}`}>Live</span>
          </div>
          <div className={styles.statValue}>{stats.kunjunganHariIni}</div>
        </div>
      </div>

      <div className={styles.header} style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
        <h2 className={styles.title} style={{ fontSize: '1.5rem' }}>Aksi Admin</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/admin/laporan">
          <button className={styles.button}>Lihat Laporan Lengkap</button>
        </Link>
        <Link href="/admin/jadwal-dokter">
          <button className={`${styles.button} ${styles.buttonOutline}`}>Kelola Jadwal Dokter</button>
        </Link>
      </div>
    </div>
  );
}
