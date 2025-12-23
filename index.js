import express from 'express';
import WebTorrent from 'webtorrent';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURAZIONE PER ESM (Sostituisce __dirname) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -----------------------------------------------------

const app = express();
const client = new WebTorrent();

const PORT = process.env.PORT || 3000;

// Serve i file statici
app.use(express.static(path.join(__dirname, 'public')));

// Rotta Home Page
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

// Endpoint Streaming
app.get('/stream', (req, res) => {
    const magnet = req.query.magnet;
    if (!magnet) return res.status(400).send('Manca il Magnet Link');

    // Recupera o aggiunge il torrent
    let torrent = client.get(magnet);
    if (!torrent) {
        // Usa una cartella temporanea specifica
        torrent = client.add(magnet, { path: '/tmp/webtorrent' });
    }

    // Quando i metadati sono pronti
    torrent.on('ready', () => {
        // Trova il file video
        const file = torrent.files.find(f => 
            f.name.endsWith('.mp4') || 
            f.name.endsWith('.mkv') || 
            f.name.endsWith('.webm')
        );

        if (!file) {
            return res.status(404).send('Nessun file video trovato nel torrent (mp4, mkv, webm)');
        }

        // Gestione Range Request (Streaming parziale)
        const range = req.headers.range;
        if (!range) {
            res.writeHead(200, { 
                'Content-Length': file.length, 
                'Content-Type': 'video/mp4' 
            });
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

    torrent.on('error', (err) => {
        console.error("Errore Torrent:", err);
        // Evitiamo crash se l'header è già stato inviato
        if (!res.headersSent) res.status(500).send("Errore nel download del torrent");
    });
});

// Statistiche
app.get('/stats', (req, res) => {
    const magnet = req.query.magnet;
    const torrent = client.get(magnet);
    if (torrent) {
        res.json({ 
            progress: torrent.progress, 
            downloadSpeed: torrent.downloadSpeed, 
            peers: torrent.numPeers 
        });
    } else {
        res.json({ error: 'Torrent non attivo o in caricamento...' });
    }
});

app.listen(PORT, () => {
    console.log(`Server Hybrid ESM avviato su porta ${PORT}`);
});
