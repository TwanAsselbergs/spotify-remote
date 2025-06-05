# Spotify Remote


## Table of Contents

  - [Overview](#overview)
  - [Author(s)](#authors)
  - [License](#license)


## Overview

For this project I built a remote controller using WebSockets. With this, you are able to control your Spotify app on your phone or laptop by using the controls visible on the website. Because of WebSockets, Spotify gets updated in real-time and you will be able to see album covers and artists among other things.

1. Front-end (`/react`)

   - A front-end application built using React and Tailwind CSS.
   - Where the WebSocket server is set up, updating the content in real-time.
   - The WebSocket server serves as a bridge between the front-end and the Spotify API.

2. API (`/server`)

   - Handles the connection to the official Spotify API.
     

## Author(s)

- **Twan Asselbergs** - [TwanAsselbergs](https://github.com/TwanAsselbergs)


## License

This project is licensed under the [MIT](LICENSE) License - see the [LICENSE](LICENSE) file for details.
