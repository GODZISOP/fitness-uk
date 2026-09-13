const https = require('https');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GROQ_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : '';

const options = {
  hostname: 'api.groq.com',
  port: 443,
  path: '/openai/v1/models',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.data) {
      console.log("AVAILABLE MODELS:");
      json.data.forEach(m => console.log(m.id));
    } else {
      console.log("ERROR:", json);
    }
  });
});
req.on('error', e => console.error(e));
req.end();
