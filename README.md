# LAN Musicplayer
Simple audio player to stream local mp3 file via LAN

## Setup
1. Clone the repository
2. In the root directory of the project, install the npm packages
```bash
npm install
```
3. Copy a song into the root directory of a project and rename it to song.mp3
4. Run the server
```bash
node index.js
```
The server should be available at localhost:8000. In order to use it on your LAN, simply unblock port 8000 for both inbound and outbound requests, the access the player through your computer's LAN address.
For best performance, use with a reverse proxy such as Nginx
