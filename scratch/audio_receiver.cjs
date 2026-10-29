const http = require('http');
const fs = require('fs');
const path = require('path');

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
        const urlParams = new URL(req.url, 'http://localhost:4567');
        const filename = urlParams.searchParams.get('file') || 'bunny_extracted.wav';
        const targetPath = path.join(__dirname, '..', 'public', 'sounds', filename);
        
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            fs.writeFileSync(targetPath, buffer);
            console.log(`[SAVED] ${filename} (${buffer.length} bytes) to ${targetPath}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, file: filename, bytes: buffer.length }));
        });
        return;
    }

    res.writeHead(404);
    res.end();
});

server.listen(4567, () => {
    console.log('Audio receiver server listening on port 4567');
});
