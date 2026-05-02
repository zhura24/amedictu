const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "amedictu_db",
  });

  console.log("Mulai seeding...");

  await conn.query("SET FOREIGN_KEY_CHECKS = 0");
  await conn.query("TRUNCATE TABLE notifikasi");
  await conn.query("TRUNCATE TABLE rekam_medis");
  await conn.query("TRUNCATE TABLE antrian");
  await conn.query("TRUNCATE TABLE pasien");
  await conn.query("TRUNCATE TABLE users");
  await conn.query("SET FOREIGN_KEY_CHECKS = 1");

  const adminPass  = await bcrypt.hash("admin123", 10);
  const dokterPass = await bcrypt.hash("dokter123", 10);
  const pasienPass = await bcrypt.hash("pasien123", 10);

  await conn.query("INSERT INTO users (username, password, role, createdAt, updatedAt) VALUES (?, ?, 'admin', NOW(), NOW())", ["admin", adminPass]);
  console.log("Akun admin dibuat");

  await conn.query("INSERT INTO users (username, password, role, createdAt, updatedAt) VALUES (?, ?, 'tenaga_medis', NOW(), NOW())", ["dr.sari", dokterPass]);
  console.log("Akun dokter dibuat");

  const [result] = await conn.query("INSERT INTO users (username, password, role, createdAt, updatedAt) VALUES (?, ?, 'pasien', NOW(), NOW())", ["budi_santoso", pasienPass]);
  const userId = result.insertId;

  await conn.query(
    "INSERT INTO pasien (no_rekam_medis, nama_depan, nama_belakang, no_telp, alamat, jenis_kelamin, gol_darah, nik, nama_darurat, hub_darurat, telp_darurat, id_user, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
    ["RM-001", "Budi", "Santoso", "081234567890", "Jl. Diponegoro No. 1, Semarang", "laki_laki", "A", "3374010101900001", "Siti Santoso", "Istri", "081234567891", userId]
  );
  console.log("Akun pasien dibuat");

  await conn.end();
  console.log("\nSeeding selesai!");
  console.log("Admin        -> username: admin        | password: admin123");
  console.log("Tenaga Medis -> username: dr.sari      | password: dokter123");
  console.log("Pasien       -> username: budi_santoso | password: pasien123");
}

main().catch((e) => { console.error("Error:", e.message); process.exit(1); });