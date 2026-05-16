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
  
  // State untuk Modal Rekam Medis
  const [showModal, setShowModal] = useState(false);
  const [selectedAntrean, setSelectedAntrean] = useState<Antrean | null>(null);
  const [formData, setFormData] = useState({
    diagnosa: "",
    resep_obat: "",
    aturan_minum: ""
  });

  const fetchAntrean = async () => {
    try {
      const res = await fetch("/api/antrean");
      const data = await res.json();
      if (data.success) setAntreanList(data.data);
    } catch (err) {
      console.error("Gagal memuat antrean");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const handleOpenModal = (antrean: Antrean) => {
    setSelectedAntrean(antrean);
    setShowModal(true);
  };

  const handleUpdateStatus = async (id: number, newStatus: StatusAntrian, rekamMedis?: any) => {
    try {
      const res = await fetch(`/api/antrean/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, rekam_medis: rekamMedis })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({ diagnosa: "", resep_obat: "", aturan_minum: "" });
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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kelola Antrean</h1>
        <p className={styles.subtitle}>Panggil pasien dan input rekam medis secara real-time.</p>
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
                      <button onClick={() => handleOpenModal(antrean)} className={styles.button} style={{ backgroundColor: 'var(--success)' }}>Selesai</button>
                    )}
                    {antrean.status === "selesai" && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Telah Selesai</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL INPUT REKAM MEDIS */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Input Hasil Pemeriksaan</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Pasien: <strong>{selectedAntrean?.nama_depan} {selectedAntrean?.nama_belakang}</strong>
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Diagnosa / Riwayat Penyakit</label>
              <textarea 
                rows={4}
                placeholder="Tuliskan diagnosa pasien..."
                value={formData.diagnosa}
                onChange={e => setFormData({...formData, diagnosa: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Daftar Obat (Resep)</label>
              <textarea 
                rows={3}
                placeholder="Contoh: Paracetamol 500mg, Amoxicillin..."
                value={formData.resep_obat}
                onChange={e => setFormData({...formData, resep_obat: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Aturan Minum</label>
              <input 
                type="text"
                placeholder="Contoh: 3 x 1 sesudah makan"
                value={formData.aturan_minum}
                onChange={e => setFormData({...formData, aturan_minum: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className={styles.button} style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Batal</button>
              <button 
                onClick={() => selectedAntrean && handleUpdateStatus(selectedAntrean.id_antrian, "selesai", formData)} 
                className={styles.button}
              >
                Simpan & Selesaikan Antrean
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  );
}

