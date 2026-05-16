"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "../../login/page.module.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function MedisLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
        role: "tenaga_medis" // Kunci agar hanya tenaga medis yang bisa login di sini
      });

      if (result?.error) {
        setError("Username atau kata sandi salah!");
      } else {
        router.push("/medis/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel} style={{ backgroundColor: '#f0fdfa' }}>
        <div className={styles.formWrapper}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '8px', height: '24px', backgroundColor: '#0d9488', borderRadius: '4px' }}></div>
            <span style={{ fontWeight: 800, letterSpacing: '0.1em', color: '#0d9488', fontSize: '0.75rem' }}>PORTAL TENAGA MEDIS</span>
          </div>

          <h2 className={styles.title}>Login Petugas</h2>
          <p className={styles.subtitle}>Silakan masuk ke portal medis terpadu</p>
          
          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500, border: '1px solid #f87171' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>USERNAME PETUGAS</label>
              <input 
                type="text" 
                id="username" 
                className={styles.input} 
                placeholder="dr.sari" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>PASSWORD</label>
              <div className={styles.passwordField}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className={styles.input} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </span>
              </div>
            </div>
            
            <button type="submit" className={styles.button} style={{ backgroundColor: '#0d9488' }} disabled={isLoading}>
              {isLoading ? "Memverifikasi..." : "Masuk Petugas"}
            </button>
          </form>
          
          <p className={styles.linkText} style={{ marginTop: '2rem' }}>
            <Link href="/" className={styles.link} style={{ color: '#0d9488' }}>&larr; Kembali ke Beranda</Link>
          </p>
        </div>
      </div>
      
      <div className={styles.rightPanel} style={{ background: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)' }}>
        <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <h1 className={styles.logo}>AMEDICTU</h1>
        <p className={styles.welcomeText}>
          Portal Tenaga Medis untuk manajemen antrean dan rekam medis terpadu.
        </p>
      </div>
    </div>
  );
}
