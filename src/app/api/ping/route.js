import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This endpoint actively queries the database to keep Supabase alive and prevent pausing after 7 days
export async function GET() {
  try {
    let data = null;
    if (supabase && typeof supabase.from === 'function') {
      const res = await supabase.from('clients').select('id').limit(1);
      data = res.data;
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Supabase heartbeat received — project kept active',
      dataFetched: !!data,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'pinged_with_note', 
      message: error?.message || 'Heartbeat queried',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  }
}
