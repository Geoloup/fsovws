const WebSocket = require('ws');

function createClient(url) {
    const ws = new WebSocket(url);
    const pending = new Map();

    ws.on('message', (data) => {
        const { id, result, error } = JSON.parse(data);
        if (pending.has(id)) {
            const { resolve, reject } = pending.get(id);
            
            if (error) {
                reject(new Error(error));
            } else {
                const finalResult = (result && result._isBuffer) 
                    ? Buffer.from(result.data, 'base64') 
                    : result;
                resolve(finalResult);
            }
            pending.delete(id);
        }
    });

    return new Proxy({}, {
        get(target, method) {
            return (...args) => {
                return new Promise((resolve, reject) => {
                    const id = Math.random().toString(36).substring(2, 11);
                    pending.set(id, { resolve, reject });
                    
                    const send = () => ws.send(JSON.stringify({ id, method, args }));
                    
                    if (ws.readyState === WebSocket.OPEN) {
                        send();
                    } else {
                        ws.once('open', send);
                        ws.once('error', (err) => reject(err));
                    }
                });
            };
        }
    });
}

module.exports = { createClient };
