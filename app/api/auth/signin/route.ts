import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      return Response.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET belum diset di environment");
    }

    const token = jwt.sign(
      {
        id: user.id_user,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET!, 
      { expiresIn: "1d" }
    );

    return Response.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id_user,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return Response.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}