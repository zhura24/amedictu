"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if ((username === "budi_santoso" || username === "Budi Santoso") && password === "pasien123") {
      router.push("/pasien/dashboard");
    } else {
      setError("Username atau kata sandi salah!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.switchContainer}>
            <button className={`${styles.switchButton} ${styles.active}`}>Masuk</button>
            <button className={styles.switchButton} onClick={() => router.push('/register')}>Daftar</button>
          </div>

          <h2 className={styles.title}>Selamat Datang Kembali</h2>
          <p className={styles.subtitle}>Masuk untuk mengakses sistem antrian Anda</p>
          
          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500, border: '1px solid #f87171' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>USERNAME / NOMOR TELEPON</label>
              <input 
                type="text" 
                id="username" 
                className={styles.input} 
                placeholder="budi_santoso" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>KATA SANDI</label>
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
              <button 
                type="button" 
                onClick={() => alert('Fitur lupa kata sandi belum tersedia')} 
                className={styles.forgotPassword} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Lupa Kata Sandi?
              </button>
            </div>
            
            <button type="submit" className={styles.button}>Masuk</button>
          </form>
          
          <div className={styles.divider}>atau</div>
          
          <p className={styles.linkText}>
            Belum punya akun? <Link href="/register" className={styles.link}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <svg className={styles.logoIcon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10L10 40V90H35V60H65V90H90V40L50 10Z" stroke="white" strokeWidth="4" strokeLinejoin="round"/>
          <circle cx="50" cy="55" r="15" stroke="white" strokeWidth="4"/>
          <path d="M50 45V65M40 55H60" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <h1 className={styles.logo}>AMEDICTU</h1>
        <p className={styles.welcomeText}>
          Antrean Medik Tunggu
        </p>
      </div>
    </div>
  );
}
