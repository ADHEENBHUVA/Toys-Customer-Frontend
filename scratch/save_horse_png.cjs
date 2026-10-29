const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const base64Data = body.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync('public/images/toy_rocking_horse.png', Buffer.from(base64Data, 'base64'));
      console.log('SUCCESSFULLY_SAVED_PNG_SIZE:', fs.statSync('public/images/toy_rocking_horse.png').size);
      res.writeHead(200);
      res.end('SAVED');
      setTimeout(() => process.exit(0), 500);
    });
  }
});

server.listen(5178, () => {
  console.log('Server listening on port 5178');
});
