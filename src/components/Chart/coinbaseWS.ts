const url = 'wss://ws-feed.prime.coinbase.com';
const socket = new WebSocket(url);

socket.addEventListener('open', ev => {
  console.info(ev);
  socket.send(
    JSON.stringify({
      type: 'subscribe',
      product_ids: ['BTC-USD'],
      channels: [
        // 'level2',
        // 'heartbeat',
        {
          name: 'ticker',
          product_ids: ['BTC-USD']
        }
      ]
    })
  );
});

socket.addEventListener('message', event => {
  // handler(event.data);
});
