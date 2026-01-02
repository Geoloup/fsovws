const { WebSocketServer } = require('ws');
const fs = require('fs').promises;

function startServer(port) {
    const wss = new WebSocketServer({ port });

    wss.on('connection', (ws) => {
        ws.on('message', async (data) => {
            const { id, method, args } = JSON.parse(data);
            try {
                if (typeof fs[method] !== 'function') {
                    throw new Error(`Method ${method} not found on fs.promises`);
                }

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
