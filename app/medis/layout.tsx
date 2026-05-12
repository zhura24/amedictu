"use client";

import Sidebar from "../../components/Sidebar";
import styles from "../../components/Sidebar.module.css";
import { usePathname } from "next/navigation";

export default function MedisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/medis/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar role="medis" />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
