<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hybrid Torrent Streamer</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #111; color: white; text-align: center; padding: 20px; }
        input { padding: 10px; width: 70%; border-radius: 5px; border: none; }
        button { padding: 10px 20px; background: #e50914; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;}
        video { width: 100%; max-width: 800px; margin-top: 20px; background: black; }
        #stats { margin-top: 10px; color: #aaa; font-size: 0.9em; }
    </style>
</head>
<body>

    <h1>Hybrid Torrent Player</h1>
    <p>Questo server scarica via TCP/UDP e ti invia lo stream pulito.</p>

    <div>
        <input type="text" id="magnet" placeholder="Incolla Magnet Link qui...">
        <button onclick="playVideo()">Riproduci</button>
    </div>

    <div id="stats">In attesa...</div>
    
    <video id="videoPlayer" controls></video>

    <script>
        let interval = null;

        function playVideo() {
            const magnet = document.getElementById('magnet').value;
            const video = document.getElementById('videoPlayer');
            
            if (!magnet) return alert("Inserisci un link!");

            // 1. Costruiamo l'URL che punta al NOSTRO server backend
            // encodeURIComponent è vitale per passare caratteri speciali nell'URL
            const streamUrl = `/stream?magnet=${encodeURIComponent(magnet)}`;
            
            // 2. Diciamo al video player di caricare quell'URL
            video.src = streamUrl;
            video.play();

            document.getElementById('stats').innerText = "Buffering dal server...";

            // 3. Avviamo un piccolo loop per chiedere le statistiche al server
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                fetch(`/stats?magnet=${encodeURIComponent(magnet)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) return;
                        const speed = (data.downloadSpeed / 1024 / 1024).toFixed(2);
                        const progress = (data.progress * 100).toFixed(1);
                        document.getElementById('stats').innerText = 
                            `Server Download: ${progress}% | Velocità: ${speed} MB/s | Peers Server: ${data.peers}`;
                    });
            }, 2000);
        }
    </script>
</body>
</html>
