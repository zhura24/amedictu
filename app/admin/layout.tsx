"use client";

import Sidebar from "../../components/Sidebar";
import styles from "../../components/Sidebar.module.css";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar role="admin" />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
