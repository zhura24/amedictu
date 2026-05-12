"use client";

import styles from "../../../components/UI.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AmbilAntrean() {
  const [selectedPoli, setSelectedPoli] = useState("Poli Umum");
  const [keluhan, setKeluhan] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoli) {
      alert("Silakan pilih poli tujuan");
      return;
    }
    // Simulate submission state change to match Figma state 5
    setIsSubmitted(true);
    // In a real app we would navigate or show a success modal here.
    // router.push("/pasien/dashboard");
  };

  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Ambil Antrian</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ambil nomor antrian secara online</p>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {currentDate}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* LEFT COLUMN - FORM */}
        <div className={styles.card} style={{ flex: 2, padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Ambil Nomor Antrian Baru</h2>
          
          <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#3b82f6' }}>ℹ️</span>
            <p style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>Data nama dan nomor rekam medis diisi otomatis dari profil Anda. Pilih poli dan tanggal kunjungan.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NAMA PASIEN</label>
              <input type="text" value="Budi Santoso" readOnly style={{ width: '100%', padding: '0.875rem', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontWeight: 500, fontFamily: 'inherit', outline: 'none', cursor: 'default' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NOMOR REKAM MEDIS</label>
              <input type="text" value="RM-000123" readOnly style={{ width: '100%', padding: '0.875rem', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontWeight: 500, fontFamily: 'inherit', outline: 'none', cursor: 'default' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PILIH POLI LAYANAN</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {['Poli Umum', 'Poli Gigi', 'Poli Anak', 'Poli THT', 'Poli KIA', 'Laboratorium'].map((poli) => (
                  <div 
                    key={poli} 
                    onClick={() => setSelectedPoli(poli)}
                    style={{ 
                      padding: '1rem', 
                      border: selectedPoli === poli ? '2px solid var(--primary)' : '1px solid #e5e7eb',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: selectedPoli === poli ? '#ebf8f8' : 'white'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{poli}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kuota: 50 tersisa</p>
                    </div>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: selectedPoli === poli ? '4px solid var(--primary)' : '1px solid #d1d5db', backgroundColor: 'white' }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TANGGAL KUNJUNGAN</label>
              <input type="date" defaultValue="2026-04-22" style={{ width: '100%', padding: '0.875rem', border: '1px solid #d1d5db', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontWeight: 500 }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KELUHAN (OPSIONAL)</label>
              <textarea 
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                rows={3}
                placeholder="Deskripsikan keluhan Anda secara singkat..."
                style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            <button type="submit" style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', color: 'white', fontWeight: 700, borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              Ambil Nomor Antrian
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN - STATUS CARDS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Nomor Antrian Anda</p>
              <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>{isSubmitted ? 'A-028' : '-'}</h2>
              <p style={{ fontSize: '1rem', opacity: 0.9 }}>{selectedPoli}</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Tanggal Kunjungan</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>22 April 2026</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Dokter</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>Dr. Sari</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Estimasi Tunggu</span>
                <strong style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>± 25 menit</strong>
              </div>
            </div>
          </div>

          <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ backgroundColor: 'var(--primary-dark)', padding: '1rem 1.5rem', color: 'white' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em' }}>STATUS ANTRIAN SAAT INI</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sedang Dipanggil</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>A-020</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Berikutnya</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>A-021</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Antrian Anda</span>
                <strong style={{ color: '#d97706', fontSize: '1rem' }}>{isSubmitted ? 'A-028' : '-'}</strong>
              </div>

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>INFORMASI PENTING</h4>
                <ol style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '1rem', margin: 0, lineHeight: 1.6 }}>
                  <li>Hadir 15 menit sebelum estimasi waktu panggil</li>
                  <li>Bawa kartu identitas & kartu rekam medis</li>
                  <li>Nomor hangus jika tidak hadir saat dipanggil</li>
                </ol>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
