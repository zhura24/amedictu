"use client";

import Sidebar from "../../components/Sidebar";
import styles from "../../components/Sidebar.module.css";

export default function PasienLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutWrapper}>
      <Sidebar role="pasien" />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
