const { WebSocketServer } = require('ws');
const https = require('https');
const fs = require('fs').promises;
const fsSync = require('fs');

function startServer(port, sslOptions = null) {
    let wss;
    
    if (sslOptions) {
        const server = https.createServer(sslOptions);
        wss = new WebSocketServer({ server });
        server.listen(port);
    } else {
        wss = new WebSocketServer({ port });
    }

    wss.on('connection', (ws) => {
        ws.on('message', async (data) => {
            const { id, method, args } = JSON.parse(data);
            try {
                let result = await fs[method](...args);
                if (Buffer.isBuffer(result)) {
                    result = { _isBuffer: true, data: result.toString('base64') };
                }
                ws.send(JSON.stringify({ id, result }));
            } catch (error) {
                ws.send(JSON.stringify({ id, error: error.message }));
            }
        });
    });
    return wss;
}

module.exports = { startServer };
