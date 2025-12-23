import express from 'express';
import WebTorrent from 'webtorrent';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configurazione percorsi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TMP_DIR = '/tmp/webtorrent';

// PULIZIA AVVIO: Cancella vecchi file temporanei per evitare "Disk Full"
if (fs.existsSync(TMP_DIR)) {
    try {
        fs.rmSync(TMP_DIR, { recursive: true, force: true });
        console.log("Pulizia cartella temporanea completata.");
    } catch (e) {
        console.error("Errore pulizia tmp:", e);
    }
}

const app = express();
// Limitiamo la velocità di upload per non intasare la banda di Render
const client = new WebTorrent({ uploadLimit: 1024 * 50 }); // 50KB/s upload limit

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rotta Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint Stream
app.get('/stream', (req, res) => {
    const magnet = req.query.magnet;
    if (!magnet) return res.status(400).send('Manca Magnet Link');

    // Recupera torrent esistente o aggiungi nuovo
    let torrent = client.get(magnet);
    if (!torrent) {
        try {
            torrent = client.add(magnet, { path: TMP_DIR });
        } catch (err) {
            console.error("Errore aggiunta torrent:", err);
            return res.status(500).send("Errore critico aggiunta torrent: " + err.message);
        }
    }

    // Timeout di sicurezza: se non trova metadati in 20 secondi, annulla
    const timeout = setTimeout(() => {
        if (!res.headersSent) res.status(504).send("Timeout: Nessun peer trovato in 20 secondi.");
    }, 20000);

    torrent.on('ready', () => {
        clearTimeout(timeout);
        
        // Cerca file video supportati
        const file = torrent.files.find(f => 
            f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || 
            f.name.endsWith('.webm') || f.name.endsWith('.avi')
        );

        if (!file) return res.status(404).send('Nessun video trovato nel torrent');

        console.log(`Streaming file: ${file.name}`);

        const range = req.headers.range;
        if (!range) {
            res.writeHead(200, { 
                'Content-Length': file.length, 
                'Content-Type': 'video/mp4' // Diciamo al browser che è mp4 anche se non lo è, per forzare il download/stream
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
        clearTimeout(timeout);
        console.error("Errore Torrent:", err);
        if (!res.headersSent) res.status(500).send("Errore interno WebTorrent: " + err.message);
    });
});

app.listen(PORT, () => {
    console.log(`Server avviato su porta ${PORT}`);
});
