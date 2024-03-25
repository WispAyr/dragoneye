const express = require('express');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const app = express();
const port = 4343;

// Serve static files from the 'public' directory
app.use(express.static('public'));

const server = app.listen(port, () => console.log(`Server running at http://localhost:${port}/`));

const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = request.url;
    if (pathname.startsWith('/camera')) {
        wss.handleUpgrade(request, socket, head, ws => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

let ffmpegProcesses = [];

wss.on('connection', (ws, request) => {
  console.log('Client connected to', request.url);
  const cameraId = request.url.split('/')[2]; // Assuming URL pattern is /camera/cameraId
  console.log(`Starting stream for ${cameraId}`);

  const ffmpeg = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',
    '-fflags', '+genpts+discardcorrupt',
    '-i', 'rtsp://admin:123456@192.168.123.180:554/stream1', // your RTSP URL
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-b:v', '10240k', // set to the same as your camera's bitrate for best quality
    '-r', '25', // set to the same frame rate as your camera
    'pipe:1'
  ]);
  

  ffmpeg.stdout.on('data', data => {
    ws.send(data, error => {
      if (error) {
        console.error('WebSocket send error:', error);
      }
    });
  });

  ffmpeg.stderr.on('data', data => {
    console.error(`FFmpeg Error for ${cameraId}: ${data}`);
  });

  ffmpeg.on('exit', (code, signal) => {
    console.log(`FFmpeg process for ${cameraId} exited with code ${code}, signal ${signal}`);
  });

  ffmpegProcesses.push(ffmpeg);

  ws.on('close', () => {
    console.log(`Client disconnected from ${cameraId}`);
    const index = ffmpegProcesses.indexOf(ffmpeg);
    if (index > -1) {
      ffmpegProcesses.splice(index, 1); // Remove the process from the tracking array
    }
    ffmpeg.kill('SIGINT'); // Ensure FFmpeg process is killed when client disconnects
  });
});

const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  ffmpegProcesses.forEach(process => process.kill('SIGINT')); // Kill all FFmpeg processes
  ffmpegProcesses = []; // Clear the array after killing all processes
  wss.close(() => console.log('WebSocket Server closed'));
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
