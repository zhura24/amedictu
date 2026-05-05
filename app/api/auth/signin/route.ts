import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();
    const [rows] = await conn.query<any[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    conn.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      );
    }

    const user = rows[0];

    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Password salah' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        username: user.username,
        role: user.role
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      data: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token
      },
      message: 'Login berhasil'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Terjadi kesalahan server',
        details: String(error)
      },
      { status: 500 }
    );
  }
}