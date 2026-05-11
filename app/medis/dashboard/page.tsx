"use client";

import { useState, useEffect } from "react";
import styles from "../../../components/UI.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

type StatusAntrian = "menunggu" | "dipanggil" | "selesai";

interface Antrean {
  id: string;
  nama: string;
  keluhan: string;
  waktu: string;
  status: StatusAntrian;
  no_rekam_medis: string;
  jenis_kelamin: string;
  tgl_lahir: string;
  no_telp: string;
}

const defaultAntrean: Antrean[] = [
  { id: "A-28", nama: "Budi Santoso", keluhan: "Demam dan pusing sejak 2 hari yang lalu", waktu: "08:15 WIB", status: "menunggu", no_rekam_medis: "RM-000123", jenis_kelamin: "Laki-laki", tgl_lahir: "17 Agustus 2000", no_telp: "081234567890" },
  { id: "A-29", nama: "Siti Aminah", keluhan: "Sakit perut bagian bawah", waktu: "08:30 WIB", status: "menunggu", no_rekam_medis: "RM-000124", jenis_kelamin: "Perempuan", tgl_lahir: "20 Mei 1995", no_telp: "081987654321" },
  { id: "A-30", nama: "Agus Pratama", keluhan: "Batuk pilek dan radang tenggorokan", waktu: "08:45 WIB", status: "menunggu", no_rekam_medis: "RM-000125", jenis_kelamin: "Laki-laki", tgl_lahir: "10 Januari 1990", no_telp: "082134567890" },
];

export default function MedisDashboard() {
  const [antreanList, setAntreanList] = useState<Antrean[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('antreanList');
    if (saved) {
      setAntreanList(JSON.parse(saved));
    } else {
      setAntreanList(defaultAntrean);
    }
  }, []);

  const handlePanggil = (id: string) => {
    const newList = antreanList.map(a => a.id === id ? { ...a, status: "dipanggil" as StatusAntrian } : a);
    setAntreanList(newList);
    localStorage.setItem('antreanList', JSON.stringify(newList));
  };

  const handleSelesai = (id: string) => {
    const newList = antreanList.map(a => a.id === id ? { ...a, status: "selesai" as StatusAntrian } : a);
    setAntreanList(newList);
    localStorage.setItem('antreanList', JSON.stringify(newList));
    
    const antrean = newList.find(a => a.id === id);
    if (antrean) {
      const storedRM = localStorage.getItem('rekamMedisList');
      const rmList = storedRM ? JSON.parse(storedRM) : [];
      if (!rmList.find((r: any) => r.id === id)) {
        rmList.push(antrean);
        localStorage.setItem('rekamMedisList', JSON.stringify(rmList));
      }
    }
  };

  const getStatusBadge = (status: StatusAntrian) => {
    switch(status) {
      case "menunggu": return <span className={`${styles.badge} ${styles.badgeMenunggu}`}>Menunggu</span>;
      case "dipanggil": return <span className={`${styles.badge}`} style={{ backgroundColor: '#bee3f8', color: '#2b6cb0' }}>Sedang Diperiksa</span>;
      case "selesai": return <span className={`${styles.badge} ${styles.badgeAktif}`}>Selesai</span>;
      default: return null;
    }
  };

  if (!isClient) return null;

  const totalPasien = antreanList.length;
  const menunggu = antreanList.filter(a => a.status === 'menunggu' || a.status === 'dipanggil').length;
  const selesai = antreanList.filter(a => a.status === 'selesai').length;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Tenaga Medis</h1>
        <p className={styles.subtitle}>Ringkasan antrean dan pasien hari ini (Poli Umum).</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Pasien Hari Ini</h3>
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
        <h2 className={styles.title} style={{ fontSize: '1.5rem' }}>Antrean Berikutnya</h2>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No. Antrean</th>
              <th>Nama Pasien</th>
              <th>Keluhan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {antreanList.map((antrean) => (
              <tr key={antrean.id} style={{ opacity: antrean.status === 'selesai' ? 0.6 : 1 }}>
                <td><strong style={{ color: antrean.status === 'selesai' ? 'var(--text-muted)' : 'var(--primary)', fontSize: '1.2rem' }}>{antrean.id}</strong></td>
                <td>{antrean.nama}</td>
                <td>{antrean.keluhan}</td>
                <td>{getStatusBadge(antrean.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {antrean.status === 'menunggu' && (
                      <button onClick={() => handlePanggil(antrean.id)} className={styles.button} style={{ backgroundColor: '#3182ce' }}>Panggil</button>
                    )}
                    {antrean.status === 'dipanggil' && (
                      <button onClick={() => handleSelesai(antrean.id)} className={styles.button} style={{ backgroundColor: 'var(--success)' }}>Selesai</button>
                    )}
                    {antrean.status === 'selesai' && (
                      <button onClick={() => router.push('/medis/rekam-medis')} className={`${styles.button} ${styles.buttonOutline}`}>Detail</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
