import { NextResponse } from 'next/server';
import { createClient } from '@vercel/edge-config';

export const config = {
  matcher: '/api/:path*'
};

export async function middleware(request) {
  try {
    const edge = createClient(process.env.EDGE_CONFIG);
    await edge.get('config_test');
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Edge Config connection failed' },
      { status: 500 }
    );
  }
}
