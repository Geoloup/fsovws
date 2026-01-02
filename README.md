# fsovws

**File System Over WebSocket** — Access Node.js `fs` functions remotely via WebSocket. Designed specifically for ElectronJS architectures.


## Installation

```bash
npm install ws
```

## Usage

### Server (Main Process / Node Server)

The server exposes the `fs.promises` methods on a dedicated port.

```javascript
const { startServer } = require('fsovws');

// Start the server on port 3000
startServer(3000);
```

### Client (Renderer Process / Remote Client)

The client creates a `Proxy` object that maps calls to the server.

```javascript
const { createClient } = require('fsovws');

const fs = createClient('ws://localhost:3000');

async function run() {
    // Create a file remotely
    await fs.writeFile('remote.txt', 'Hello from fsovws');

    // Read a remote file
    const data = await fs.readFile('remote.txt', 'utf-8');
    console.log(data);
}

run();
```

## Features

* **Native API**: Uses the same syntax as `require('fs').promises`.
* **Binary Support**: Automatic conversion of `Buffer` objects for transfer.
* **Asynchronous**: Fully based on `Promises` (async/await).
* **Lightweight**: Minimal dependency (`ws`).

## License

This project is licensed under the **MIT** license.

**Made by gilay04** — [https://geoloup.com/](https://geoloup.com/)
