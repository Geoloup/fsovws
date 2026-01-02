import { WebSocketServer } from 'ws';
import https from 'https';
import fs from 'fs/promises';

function _setupWSS(wss) {
    wss.on('connection', (ws) => {
        ws.on('message', async (data) => {
            const { id, method, args } = JSON.parse(data);
            try {
                if (typeof fs[method] !== 'function') throw new Error(`Method ${method} unknown`);
                
                let result = await fs[method](...args);
                if (result instanceof Buffer || (result && result.buffer instanceof ArrayBuffer)) {
                    result = { _isBuffer: true, data: Buffer.from(result).toString('base64') };
                }
                ws.send(JSON.stringify({ id, result }));
            } catch (error) {
                ws.send(JSON.stringify({ id, error: error.message }));
            }
        });
    });
}

export function startFSServer(port, sslOptions) {
    const server = https.createServer(sslOptions);
    const wss = new WebSocketServer({ server });
    _setupWSS(wss);
    server.listen(port);
    return wss;
}

export function startUnsecureFSServer(port) {
    const wss = new WebSocketServer({ port });
    _setupWSS(wss);
    return wss;
}