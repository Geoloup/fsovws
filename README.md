# fsovws

**File System Over WebSocket** — Access Node.js `fs` functions remotely via WebSocket. Designed specifically for ElectronJS architectures.

## Installation

```bash
npm install fsovws
```

## Usage

### Server (Main Process / Node Server)

The server exposes the `fs.promises` methods on a dedicated port.

#### Secure Server (HTTPS)

```javascript
const { startFSServer } = require('fsovws');
const fs = require('fs');

// SSL options for HTTPS
const sslOptions = {
  cert: fs.readFileSync('path/to/cert.pem'),
  key: fs.readFileSync('path/to/key.pem')
};

// Start the secure server on port 3000
startFSServer(3000, sslOptions);
```

#### Unsecure Server (HTTP)

```javascript
const { startUnsecureFSServer } = require('fsovws');

// Start the unsecure server on port 3000
startUnsecureFSServer(3000);
```

### Client (Renderer Process / Remote Client)

The client creates a `Proxy` object that maps calls to the server.

#### Secure Connection

```javascript
const { connectToFS } = require('fsovws');

const fs = connectToFS('wss://localhost:3000');

async function run() {
    // Create a file remotely
    await fs.writeFile('remote.txt', 'Hello from fsovws');

    // Read a remote file
    const data = await fs.readFile('remote.txt', 'utf-8');
    console.log(data);

    // List directory contents
    const files = await fs.readdir('.');
    console.log(files);

    // Get file stats
    const stats = await fs.stat('remote.txt');
    console.log(stats);
}

run();
```

#### Unsecure Connection

```javascript
const { connectToUnsecureFS } = require('fsovws');

const fs = connectToUnsecureFS('ws://localhost:3000');

// Same usage as above
```

## Features

* **Native API**: Uses the same syntax as `require('fs').promises`.
* **Binary Support**: Automatic conversion of `Buffer` objects for transfer.
* **Asynchronous**: Fully based on `Promises` (async/await).
* **Lightweight**: Minimal dependency (`ws`).

## Publishing to npm

To publish this package to npm:

1. Ensure you have an npm account and are logged in:
   ```bash
   npm login
   ```

2. Navigate to the package directory:
   ```bash
   cd fsows
   ```

3. Update the version in `package.json` if necessary.

4. Publish the package:
   ```bash
   npm publish
   ```

Note: For secure publishing, consider using npm's two-factor authentication.

## License

This project is licensed under the **MIT** license.

**Made by gilay04** — [https://geoloup.com/](https://geoloup.com/)
