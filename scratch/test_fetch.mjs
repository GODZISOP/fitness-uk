const url = 'https://khkiyplybehsspxtmvkf.supabase.co/rest/v1/clients?select=*';
const anonKey = 'sb_publishable_-WBbXW90QrO2Am4lesj76w_k8_x50f1';

async function test() {
  const res = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    }
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', data);
}
test();
