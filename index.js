const Stream = require('node-rtsp-stream');
const express = require('express');
const app = express();
const port = 4343;

app.use(express.static('public'));

const streamUrl = 'rtsp://rtspstream:3c2456b30e437cd7c1349c13309894e1@zephyr.rtsp.stream/pattern';

// Array to keep track of all your stream instances
const streams = [];

// Camera stream configuration
const cameraStreams = [
  {
    name: 'Camera 1',
    url: streamUrl,
    wsPort: 9999
  },
  {
    name: 'Camera 2',
    url: streamUrl,
    wsPort: 10000
  },
];

// Initialize each camera stream and store references to them
cameraStreams.forEach((camera, index) => {
  const stream = new Stream({
    name: camera.name,
    streamUrl: camera.url,
    wsPort: camera.wsPort,
    ffmpegOptions: {
      '-stats': '', // an option with no necessary value uses a blank string
      '-r': 30 // 30 fps
    }
  });

  streams.push(stream);
});

// Start the HTTP server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Graceful shutdown function
function gracefulShutdown() {
  console.log('Shutting down gracefully...');

  // Attempt to stop all RTSP streams
  streams.forEach(stream => {
    // Assuming `stop` is the method to stop streaming - replace as needed
    stream.stop(); 
  });

  // Close the HTTP server
  server.close(() => {
    console.log('HTTP server closed.');

    // Exit the process
    process.exit(0);
  });
}

// Handle termination and interrupt signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
