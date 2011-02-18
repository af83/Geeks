# Geeks

Geeks is a web application to show 'real-time' position of persons on a map.
It is a node.js application, based on connect middlewares framework.

## Installation

### Node.js

Geeks works with node -v v0.4.0

### Git Repository

    $> git clone https://github.com/AF83/Geeks.git

Geeks depends on a rest-mongo and Socket.IO-node and others, which are vendorized through git submodules.
To get them and initialize some stuff:

    $> make install

### Nodetk

You should have you nodejs libraries (assert, sys...) located somewhere on your NOTE_PATH environment variable.

## Running

As simple as:

    $> node src/server.js

When changing templates files, you should run:

    $> make templates_ms

## License

AGPLv3
