<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Torrent to VLC Bridge</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #121212; color: #e0e0e0; text-align: center; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #1e1e1e; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        input { padding: 12px; width: 70%; border-radius: 5px; border: 1px solid #333; background: #2c2c2c; color: white; }
        button { padding: 12px 25px; cursor: pointer; border: none; border-radius: 5px; font-weight: bold; margin: 10px; transition: 0.2s; }
        .btn-play { background: #e50914; color: white; } /* Rosso Netflix */
        .btn-vlc { background: #ff9800; color: black; } /* Arancione VLC */
        button:hover { opacity: 0.9; transform: scale(1.05); }
        
        #result-area { display: none; margin-top: 20px; padding: 15px; background: #252525; border-radius: 5px; }
        #stream-url { word-break: break-all; color: #4caf50; font-family: monospace; margin-bottom: 10px; }
        .warning { color: #ffeb3b; font-size: 0.9em; margin-top: 10px; }
    </style>
</head>
<body>

<div class="container">
    <h1>Torrent ➔ VLC Bridge</h1>
    <p>Per file MKV (Film/Serie TV in HD), usa sempre VLC.</p>

    <input type="text" id="magnet" placeholder="Incolla Magnet Link qui...">
    <br>
    
    <button class="btn-vlc" onclick="generateLink()">1. Genera Link Stream</button>

    <div id="result-area">
        <p>Ecco il tuo link personale:</p>
        <div id="stream-url">...</div>
        <button onclick="copyLink()">2. Copia Link</button>
        
        <p class="warning">
            <strong>Come guardare:</strong><br>
            Apri VLC ➔ File ➔ Apri Flusso di Rete (Network Stream) ➔ Incolla il link.
        </p>
    </div>
    
    <details style="margin-top: 30px;">
        <summary>Prova nel browser (Solo file MP4)</summary>
        <video id="videoPlayer" controls style="width: 100%; margin-top: 10px;"></video>
    </details>
</div>

<script>
    function generateLink() {
        const magnet = document.getElementById('magnet').value.trim();
        if (!magnet) return alert("Inserisci un magnet link!");

        // Costruisce l'URL completo del tuo server Render
        const baseUrl = window.location.origin; 
        const streamUrl = `${baseUrl}/stream?magnet=${encodeURIComponent(magnet)}`;
        
        document.getElementById('stream-url').innerText = streamUrl;
        document.getElementById('result-area').style.display = 'block';

        // Imposta anche il player web (per tentare)
        const video = document.getElementById('videoPlayer');
        video.src = streamUrl;
    }

    function copyLink() {
        const urlText = document.getElementById('stream-url').innerText;
        navigator.clipboard.writeText(urlText).then(() => {
            alert("Link copiato! Ora incollalo in VLC.");
        });
    }
</script>

</body>
</html>
