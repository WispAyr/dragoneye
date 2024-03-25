const Stream = require('node-rtsp-stream');
const express = require('express');
const app = express();
const port = 3000;

const cameraStreams = [
    {
      name: 'Camera 1',
      url: 'rtsp://b03773d78e34.entrypoint.cloud.wowza.com:1935/app-4065XT4Z/80c76e59_stream1',
      wsPort: 9999
    },
    {
      name: 'Camera 2',
      url: 'rtsp://b03773d78e34.entrypoint.cloud.wowza.com:1935/app-4065XT4Z/80c76e59_stream1',
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