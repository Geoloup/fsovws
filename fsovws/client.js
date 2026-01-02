import WebSocket from 'ws';

function connectToUnsecureFS(url) {
  const ws = new WebSocket(url);
  const pendingRequests = new Map();
  const ready = new Promise((resolve) => ws.on('open', resolve));

  ws.on('message', (rawData) => {
    const dataStr = rawData.toString();
    let msg;
    try { msg = JSON.parse(dataStr); } catch (e) { msg = { type: 'data', content: dataStr }; }

    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      msg.error ? reject(new Error(msg.error)) : resolve(msg.result ?? msg.content);
    }
  });

  const sendRequest = async (payload) => {
    await ready;
    return new Promise((resolve, reject) => {
      pendingRequests.set(payload.id, { resolve, reject });
      ws.send(JSON.stringify(payload));
    });
  };

  let requestId = 0;
  return {
    writeFile: (fileName, content) => sendRequest({ id: ++requestId, method: 'writeFile', args: [fileName, content] }),
    readFile: (fileName, encoding = 'utf8') => sendRequest({ id: ++requestId, method: 'readFile', args: [fileName, encoding] }),
    unlink: (fileName) => sendRequest({ id: ++requestId, method: 'unlink', args: [fileName] })
  };
}

function connectToFS(url) {
  return connectToUnsecureFS(url.replace('ws://', 'wss://'));
}

export { connectToUnsecureFS, connectToFS };