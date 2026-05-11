"use client";

import { useState, useEffect } from "react";
import styles from "../../../components/UI.module.css";

export default function RekamMedisPage() {
  const [activeTab, setActiveTab] = useState('riwayat');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    const storedRM = localStorage.getItem('rekamMedisList');
    if (storedRM) {
      setPatients(JSON.parse(storedRM));
    }
  }, []);

  const handleSimpanRekamMedis = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Rekam Medis Berhasil Disimpan!");
    
    // Remove from local storage list
    const newList = patients.filter(p => p.id !== selectedPatient.id);
    setPatients(newList);
    localStorage.setItem('rekamMedisList', JSON.stringify(newList));
    
    setSelectedPatient(null);
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100%', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Rekam Medis</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Catat hasil pemeriksaan dan resep obat</p>
        </div>
        <div style={{ backgroundColor: '#e5e7eb', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Senin, 22 April 2026
        </div>
      </div>

      {!selectedPatient ? (
        <div className={styles.card}>
          <h3 className={styles.cardTitle} style={{ marginBottom: '1.5rem' }}>Daftar Pasien Menunggu Pemeriksaan</h3>
          {patients.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>No. Antrean</th>
                    <th>Nama Pasien</th>
                    <th>Keluhan Awal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{p.id}</strong></td>
                      <td>{p.nama}</td>
                      <td>{p.keluhan}</td>
                      <td>
                        <button 
                          onClick={() => setSelectedPatient(p)}
                          className={styles.button}
                        >
                          Periksa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Belum ada pasien yang selesai dari antrean.
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* LEFT COLUMN */}
          <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>
            {/* PASIEN AKTIF CARD */}
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Pasien Aktif</span>
                <button onClick={() => setSelectedPatient(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800 }}>X</button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
                    {selectedPatient.nama.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>{selectedPatient.nama}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No. Antrian: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedPatient.id}</span></p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>No. Rekam Medis</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedPatient.no_rekam_medis || 'RM-000123'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Jenis Kelamin</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedPatient.jenis_kelamin || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tanggal Lahir</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedPatient.tgl_lahir || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>No. Telepon</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedPatient.no_telp || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIWAYAT KUNJUNGAN CARD */}
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem 1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                Riwayat Kunjungan
              </div>
              <div style={{ padding: '1.25rem' }}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{selectedPatient.waktu}</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Keluhan Awal</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedPatient.keluhan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            {/* TABS */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
              <div 
                style={{ padding: '1rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: activeTab === 'riwayat' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'riwayat' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer' }}
                onClick={() => setActiveTab('riwayat')}
              >
                Riwayat Kunjungan
              </div>
              <div 
                style={{ padding: '1rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: activeTab === 'resep' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'resep' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer' }}
                onClick={() => setActiveTab('resep')}
              >
                Resep Obat
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <form onSubmit={handleSimpanRekamMedis}>
                
                {activeTab === 'riwayat' && (
                  <>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>Data Vital Pasien</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>TEKANAN DARAH (MMHG)</label>
                        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>SUHU TUBUH</label>
                        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>DENYUT NADI (BPM)</label>
                        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>BERAT BADAN (KG)</label>
                        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>TINGGI BADAN (CM)</label>
                        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>SATURASI O2 (%)</label>
                        <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                      </div>
                    </div>

                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>Hasil Pemeriksaan</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>KELUHAN UTAMA PASIEN</label>
                        <textarea defaultValue={selectedPatient.keluhan} rows={3} placeholder="Deskripsikan keluhan yang disampaikan pasien secara detail..." style={{ width: '100%', padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>DIAGNOSA DOKTER</label>
                        <textarea required rows={3} placeholder="Masukkan diagnosa berdasarkan hasil pemeriksaan..." style={{ width: '100%', padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>TINDAKAN MEDIS YANG DILAKUKAN</label>
                        <textarea required rows={3} placeholder="Deskripsikan tindakan medis yang dilakukan..." style={{ width: '100%', padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>CATATAN & REKOMENDASI DOKTER</label>
                        <textarea rows={3} placeholder="Saran dokter, rekomendasi kontrol, pantangan, dll..." style={{ width: '100%', padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'resep' && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>Resep Obat</h3>
                    <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>NAMA OBAT</label>
                          <input type="text" placeholder="Contoh: Paracetamol 500mg" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>ATURAN MINUM</label>
                          <input type="text" placeholder="Contoh: 3 x 1 Sesudah Makan" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>NAMA OBAT TAMBAHAN</label>
                          <input type="text" placeholder="Contoh: Amoxicillin 500mg" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>ATURAN MINUM TAMBAHAN</label>
                          <input type="text" placeholder="Contoh: 3 x 1 Habiskan" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)' }} />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>* Resep ini akan diteruskan langsung ke bagian farmasi / apotek.</p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" onClick={() => setSelectedPatient(null)} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', border: '1px solid #d1d5db', color: 'var(--text-main)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
                    Batal
                  </button>
                  <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary)', border: 'none', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
                    Simpan Rekam Medis
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
