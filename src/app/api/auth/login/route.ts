import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Jalur 1: Admin via .env
    if (username === 'admin') {
      if (password === process.env.ADMIN_PASSWORD) {
        return NextResponse.json({
          username: 'admin',
          name: 'Pangeran Nunu',
          role: 'Admin'
        });
      }
      return NextResponse.json({ error: 'Password Admin salah' }, { status: 401 });
    }

    // Jalur 2: User via External API
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/User/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      // Asumsi API mengembalikan data user jika sukses
      return NextResponse.json({
        username: username,
        name: data.name || username,
        role: 'User'
      });
    }

    return NextResponse.json({ error: 'Username atau Password salah' }, { status: 401 });

  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
