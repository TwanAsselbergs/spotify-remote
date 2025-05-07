# Spotify Remote


## Table of Contents

  - [Overview](#overview)
  - [Author(s)](#authors)
  - [License](#license)


## Overview

Spotify Remote is a school project. For this project I had to build a remote controller using WebSockets. With this, you are able to control your Spotify app on your phone or laptop by using the controls visible on the website. Because of WebSockets, Spotify gets updated in real-time and you will be able to see the album covers and artists among other things.

1. Front-end (`/react`)

   - A front-end application built using React and Tailwind CSS
   - Able to connect with the WebSocket server

2. API (`/server`)

   - Supplies product data to the front-end.
   - Handles incoming orders by storing them in the database.
   - Uses WebSockets to broadcast new orders to the dashboard in real time.


## Author(s)

- **Twan Asselbergs** - [TwanAsselbergs](https://github.com/TwanAsselbergs)


## License

This project is licensed under the [MIT](LICENSE.md)
License - see the [LICENSE.md](LICENSE.md) file for
details
