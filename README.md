# Airport CEO Rich Presence

[![Powered by Node.js](https://img.shields.io/badge/node-LTS_Iron-green?logo=nodedotjs&label=node)](https://nodejs.org/en/download/)

Effortlessly share airport statistics with your friends on Discord!

<img src="./img/preview.svg">

## How-to:

1. Download the [latest release](https://github.com/benjammin4dayz/aceo-discord-rpc/releases/latest)
2. Start the executable
3. Start Airport CEO

## How does it work?

This program listens for the game to start before it reads data from your save file and broadcasts the presence to Discord. It updates periodically as you play by reading the latest saved game. After the game shuts down, it will clear your Discord presence and standby for the game to start once again until you close this program.
