import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
const body = await req.json();
const { username, password } = body;

if (!username || !password) {
return Response.json({ message: "Wajib diisi" }, { status: 400 });
}

const conn = await pool.getConnection();

try {
const [rows]: any = await conn.query(
"SELECT * FROM users WHERE username = ?",
[username]
);

if (rows.length === 0) {
return Response.json({ message: "User tidak ditemukan" }, { status: 404 });
}

const user = rows[0];

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
return Response.json({ message: "Password salah" }, { status: 401 });
}

return Response.json({ message: "Login berhasil" });

} finally {
conn.release();
}
}