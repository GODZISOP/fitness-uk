import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://khkiyplybehsspxtmvkf.supabase.co';
const supabaseAnonKey = 'sb_publishable_-WBbXW90QrO2Am4lesj76w_k8_x50f1';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('clients').select('*');
  console.log('Clients:', data);
  console.log('Error:', error);
}

test();
