const express = require('express');
const WebTorrent = require('webtorrent');
const path = require('path');

const app = express();
const client = new WebTorrent();

const PORT = process.env.PORT || 3000;

// Serve i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- AGGIUNTA FONDAMENTALE: Rotta esplicita per la Home Page ---
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("ERRORE: Non trovo index.html!", err);
            res.status(500).send("Errore Server: index.html mancante o cartella 'public' errata.");
        }
    });
});
// -------------------------------------------------------------

app.get('/stream', (req, res) => {
    const magnet = req.query.magnet;
    if (!magnet) return res.status(400).send('Manca il Magnet Link');

    let torrent = client.get(magnet);
    if (!torrent) torrent = client.add(magnet, { path: '/tmp/webtorrent' });

    torrent.on('ready', () => {
        const file = torrent.files.find(f => f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm'));
        if (!file) return res.status(404).send('Nessun video trovato');

        const range = req.headers.range;
        if (!range) {
            res.writeHead(200, { 'Content-Length': file.length, 'Content-Type': 'video/mp4' });
            file.createReadStream().pipe(res);
        } else {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
            const chunksize = (end - start) + 1;

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${file.length}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            });
            file.createReadStream({ start, end }).pipe(res);
        }
    });
});

app.get('/stats', (req, res) => {
    const magnet = req.query.magnet;
    const torrent = client.get(magnet);
    if (torrent) {
        res.json({ progress: torrent.progress, downloadSpeed: torrent.downloadSpeed, peers: torrent.numPeers });
    } else {
        res.json({ error: 'Torrent non attivo' });
    }
});

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
});
