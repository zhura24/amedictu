"use client";

import styles from "../../../components/UI.module.css";

export default function JadwalDokter() {
  const jadwal = [
    { hari: "Senin", jam: "08:00 - 12:00", dokter: "Dr. Sari", poli: "Poli Umum" },
    { hari: "Selasa", jam: "08:00 - 12:00", dokter: "Dr. Sari", poli: "Poli Umum" },
    { hari: "Rabu", jam: "13:00 - 17:00", dokter: "Dr. Budi", poli: "Poli Gigi" },
    { hari: "Kamis", jam: "08:00 - 12:00", dokter: "Dr. Sari", poli: "Poli Umum" },
    { hari: "Jumat", jam: "13:00 - 17:00", dokter: "Dr. Budi", poli: "Poli Gigi" },
  ];

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Jadwal Dokter</h1>
        <p className={styles.subtitle}>Informasi jam praktik dokter di klinik kami.</p>
      </div>

      <div className={styles.card} style={{ padding: '0', overflow: 'hidden' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hari</th>
              <th>Poli</th>
              <th>Nama Dokter</th>
              <th>Jam Praktik</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.map((item, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 700 }}>{item.hari}</td>
                <td>{item.poli}</td>
                <td>{item.dokter}</td>
                <td><span className={styles.badge} style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0' }}>{item.jam}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
