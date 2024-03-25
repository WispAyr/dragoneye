const Stream = require('node-rtsp-stream');
const express = require('express');
const app = express();
const port = 4343;

const cameraStreams = [
    {
      name: 'Camera 1',
      url: 'rtsp://rtspstream:32deec874b0b516cd6c5ed2bbba3a3ba@zephyr.rtsp.stream/movie',
      wsPort: 9999
    },
    {
      name: 'Camera 2',
      url: 'rtsp://rtspstream:32deec874b0b516cd6c5ed2bbba3a3ba@zephyr.rtsp.stream/movie',
      wsPort: 10000
    }
    // Add more cameras as needed
  ];
  
  app.use(express.static('public'));

  cameraStreams.forEach((camera) => {
    new Stream({
      name: camera.name,
      streamUrl: camera.url,
      wsPort: camera.wsPort,
      ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no necessary value uses a blank string
        '-r': 30 // 30 fps
      }
    });
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });