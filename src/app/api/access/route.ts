import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const expected = process.env.ACCESS_CODE || process.env.BASIC_AUTH_PASS || '';
    if (!expected) {
      return NextResponse.json({ message: 'Код доступа не настроен' }, { status: 500 });
    }
    if (typeof code !== 'string' || code.length === 0) {
      return NextResponse.json({ message: 'Введите код' }, { status: 400 });
    }
    if (code !== expected) {
      return NextResponse.json({ message: 'Неверный код' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    // Set cookie for 7 days
    res.cookies.set('access_granted', '1', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}


