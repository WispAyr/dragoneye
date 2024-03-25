# DragonEye

DragonEye is a versatile server solution designed to facilitate the viewing of RTSP streams directly in a web browser. It serves as a bridge between your RTSP-enabled cameras and a convenient, accessible web interface. The server dynamically handles multiple camera streams, displaying them in a user-friendly grid layout with support for full-screen viewing. Future iterations aim to incorporate common camera controls, enabling remote control of PTZ (Pan-Tilt-Zoom) cameras to enhance the interactivity and functionality of the system.

## Features

- **Multiple Camera Streams:** Support for handling and displaying multiple RTSP camera streams simultaneously.
- **Web-Based Viewing:** Accessible viewing of camera feeds in any modern web browser, eliminating the need for specialized client software.
- **Grid and Full-Screen Modes:** Displays camera feeds in a grid with the ability to click on any camera to view it in full-screen.
- **Future PTZ Control:** Plans to integrate PTZ camera controls directly from the web interface, allowing for remote operation of compatible cameras.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (LTS version recommended)
- RTSP-enabled cameras accessible within your network

### Installation

1. Clone the repository:

git clone https://github.com/yourusername/dragoneye.git
2. Navigate to the project directory:
cd dragoneye
3. Install the necessary dependencies:
npm install

4. Start the server:
node index.js



### Configuration

To add or remove camera streams, edit the `cameraStreams` array in `server.js` with the appropriate RTSP URLs, WebSocket ports, and any other relevant settings.

## Usage

After starting the server, open a web browser and navigate to `http://localhost:3000/` to view the camera streams. Click on any stream to view it in full-screen mode.

## Roadmap

- [x] Implement basic RTSP to WebSocket streaming functionality
- [x] Display multiple camera streams in a web interface
- [ ] Add support for full-screen view toggling
- [ ] Implement PTZ camera controls
- [ ] Enhance security features for public deployment
- [ ] Optimize performance for handling high numbers of simultaneous streams

## Contributing

We welcome contributions to DragonEye! If you have suggestions for improvements or new features, feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Special thanks to the developers of `node-rtsp-stream` and `jsmpeg` for providing the foundational technologies that make DragonEye possible.
- Gratitude to all contributors and testers who help refine and enhance DragonEye.

