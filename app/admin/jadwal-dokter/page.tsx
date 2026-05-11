"use client";

import { useState, useEffect } from "react";
import styles from "../../../components/UI.module.css";

const defaultDoctors = [
  {
    name: "dr. Budi Santoso",
    specialty: "Dokter Umum",
    schedule: {
      Senin: "08.00 - 12.00, 16.00 - 20.00",
      Selasa: "08.00 - 12.00",
      Rabu: "16.00 - 20.00",
      Kamis: "08.00 - 12.00",
      Jumat: "16.00 - 20.00",
      Sabtu: "08.00 - 12.00",
    }
  },
  {
    name: "dr. Ahmad Basuki",
    specialty: "Dokter Umum",
    schedule: {
      Senin: "13.00 - 17.00",
      Selasa: "08.00 - 12.00",
      Rabu: "13.00 - 17.00",
      Kamis: "08.00 - 12.00",
      Jumat: "13.00 - 17.00",
      Sabtu: "08.00 - 12.00",
    }
  },
  {
    name: "dr. Faradilla Aulia",
    specialty: "Dokter Umum",
    schedule: {
      Senin: "13.00 - 17.00",
      Selasa: "16.00 - 20.00",
      Rabu: "13.00 - 17.00",
      Kamis: "16.00 - 20.00",
      Jumat: "13.00 - 17.00",
      Sabtu: "",
    }
  },
  {
    name: "dr. Dhinara",
    specialty: "Dokter Gigi",
    schedule: {
      Senin: "13.00 - 17.00",
      Selasa: "08.00 - 12.00",
      Rabu: "13.00 - 17.00",
      Kamis: "",
      Jumat: "08.00 - 12.00",
      Sabtu: "",
    }
  },
  {
    name: "dr. Nur Hasna",
    specialty: "Bidan / Sp.OG",
    schedule: {
      Senin: "08.00 - 12.00",
      Selasa: "13.00 - 17.00",
      Rabu: "08.00 - 12.00",
      Kamis: "13.00 - 17.00",
      Jumat: "08.00 - 12.00",
      Sabtu: "08.00 - 12.00",
    }
  },
  {
    name: "dr. Bima",
    specialty: "Dokter Umum / Sp.A",
    schedule: {
      Senin: "13.00 - 17.00",
      Selasa: "08.00 - 12.00",
      Rabu: "13.00 - 17.00",
      Kamis: "08.00 - 12.00",
      Jumat: "13.00 - 17.00",
      Sabtu: "08.00 - 12.00",
    }
  }
];

export default function JadwalDokterPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jadwalDokter');
    if (saved) {
      setDoctors(JSON.parse(saved));
    } else {
      setDoctors(defaultDoctors);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('jadwalDokter', JSON.stringify(doctors));
    setIsEditing(false);
    alert("Jadwal dokter berhasil disimpan!");
  };

  const handleScheduleChange = (docIndex: number, day: string, value: string) => {
    const newDocs = [...doctors];
    newDocs[docIndex].schedule[day] = value;
    setDoctors(newDocs);
  };

  if (doctors.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100%', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Jadwal Dokter</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Lihat dan kelola jadwal dokter klinik</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isEditing ? (
            <>
              <button onClick={() => {
                const saved = localStorage.getItem('jadwalDokter');
                setDoctors(saved ? JSON.parse(saved) : defaultDoctors);
                setIsEditing(false);
              }} className={`${styles.button} ${styles.buttonOutline}`}>Batal</button>
              <button onClick={handleSave} className={styles.button}>Simpan Jadwal</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className={styles.button}>Edit Jadwal</button>
          )}
          <div style={{ backgroundColor: '#e5e7eb', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            Senin, 22 April 2026
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <th style={{ padding: '1.25rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.2)', width: '20%' }}>Dokter</th>
              <th style={{ padding: '1.25rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Senin</th>
              <th style={{ padding: '1.25rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Selasa</th>
              <th style={{ padding: '1.25rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Rabu</th>
              <th style={{ padding: '1.25rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Kamis</th>
              <th style={{ padding: '1.25rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.2)' }}>Jumat</th>
              <th style={{ padding: '1.25rem', fontWeight: 600 }}>Sabtu</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1.5rem 1rem', borderRight: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.specialty}</div>
                </td>
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
                  <td key={day} style={{ padding: '1.5rem 1rem', borderRight: '1px solid #e5e7eb', verticalAlign: 'top' }}>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={doc.schedule[day]} 
                        onChange={(e) => handleScheduleChange(idx, day, e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'center' }}
                      />
                    ) : (
                      doc.schedule[day].split(',').map((time: string, i: number) => time.trim() ? (
                        <div key={i} style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{time.trim()}</div>
                      ) : null)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
