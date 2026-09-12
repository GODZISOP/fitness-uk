import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://khkiyplybehsspxtmvkf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-WBbXW90QrO2Am4lesj76w_k8_x50f1';

const createSafeClient = () => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase initialization fallback triggered:', e?.message);
    return createClient('https://khkiyplybehsspxtmvkf.supabase.co', 'sb_publishable_-WBbXW90QrO2Am4lesj76w_k8_x50f1');
  }
};

export const supabase = createSafeClient();
