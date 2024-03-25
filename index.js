const express = require('express');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const app = express();
const port = 4343;

app.use(express.static('public'));

const server = app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));

const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = request.url;

    if (pathname.startsWith('/camera')) { // Dynamic paths like /camera1, /camera2, etc.
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

wss.on('connection', function connection(ws, request) {
  console.log('Client connected to', request.url);

  // Spawn FFmpeg process
  const ffmpeg = spawn('ffmpeg', [
    '-i', 'rtsp://rtspstream:3c2456b30e437cd7c1349c13309894e1@zephyr.rtsp.stream/pattern',
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-b:v', '800k',
    '-r', '30',
    'pipe:1'
  ]);

  ffmpeg.stdout.on('data', (data) => {
    ws.send(data);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg Error: ${data}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    ffmpeg.kill('SIGINT');
  });
});
