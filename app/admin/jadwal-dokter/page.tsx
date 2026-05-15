"use client";

import { useState, useEffect } from "react";
import styles from "../../../components/UI.module.css";

export default function JadwalDokterPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJadwal, setNewJadwal] = useState({
    nama_dokter: "",
    spesialis: "",
    hari: "Senin",
    jam_mulai: "08:00",
    jam_selesai: "12:00"
  });

  const fetchJadwal = async () => {
    try {
      const res = await fetch("/api/jadwal-dokter");
      const data = await res.json();
      if (data.success) setDoctors(data.data);
    } catch (err) {
      console.error("Gagal memuat jadwal");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jadwal-dokter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJadwal)
      });
      const data = await res.json();
      if (data.success) {
        alert("Jadwal berhasil ditambahkan!");
        setShowAddForm(false);
        fetchJadwal();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Gagal menambahkan jadwal");
    }
  };

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Kelola Jadwal Dokter</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sinkronisasi jadwal otomatis ke dashboard pasien.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className={styles.button}>
          {showAddForm ? "Batal" : "Tambah Jadwal Baru"}
        </button>
      </div>

      {showAddForm && (
        <div className={styles.card} style={{ marginBottom: '2rem', maxWidth: '600px' }}>
          <form onSubmit={handleAdd}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nama Dokter</label>
              <input type="text" required value={newJadwal.nama_dokter} onChange={e => setNewJadwal({...newJadwal, nama_dokter: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Spesialis / Poli</label>
              <input type="text" required value={newJadwal.spesialis} onChange={e => setNewJadwal({...newJadwal, spesialis: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hari</label>
                <select value={newJadwal.hari} onChange={e => setNewJadwal({...newJadwal, hari: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Jam Mulai</label>
                <input type="time" required value={newJadwal.jam_mulai} onChange={e => setNewJadwal({...newJadwal, jam_mulai: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Jam Selesai</label>
                <input type="time" required value={newJadwal.jam_selesai} onChange={e => setNewJadwal({...newJadwal, jam_selesai: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
            </div>
            <button type="submit" className={styles.button} style={{ width: '100%' }}>Simpan Jadwal</button>
          </form>
        </div>
      )}

      <div className={styles.card} style={{ padding: '0', overflow: 'hidden' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Dokter</th>
              <th>Spesialis</th>
              <th>Hari</th>
              <th>Jam Praktik</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id_jadwal}>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{doc.nama_dokter}</td>
                <td>{doc.spesialis}</td>
                <td>{doc.hari}</td>
                <td>{doc.jam_mulai} - {doc.jam_selesai}</td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data jadwal di database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

