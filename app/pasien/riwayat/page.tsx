"use client";

import styles from "../../../components/UI.module.css";

export default function RiwayatAntrean() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Riwayat Antrean</h1>
        <p className={styles.subtitle}>Catatan kunjungan Anda di klinik kami.</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Poli</th>
              <th>Keluhan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12 Mei 2026</td>
              <td>Poli Umum</td>
              <td>Demam dan pusing sejak 2 hari yang lalu</td>
              <td><span className={`${styles.badge} ${styles.badgeAktif}`}>Aktif</span></td>
            </tr>
            <tr>
              <td>03 Jan 2026</td>
              <td>Poli Gigi</td>
              <td>Gigi geraham bungsu ngilu</td>
              <td><span className={`${styles.badge} ${styles.badgeAktif}`} style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Selesai</span></td>
            </tr>
            <tr>
              <td>15 Agu 2025</td>
              <td>Poli Umum</td>
              <td>Batuk berdahak dan pilek</td>
              <td><span className={`${styles.badge} ${styles.badgeAktif}`} style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Selesai</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
