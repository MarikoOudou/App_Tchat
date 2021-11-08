const express = require('express')
const app = express();
const server = require('http').createServer();
const io = require('socket.io')(server);
const port = 8000;

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
});

io.on('connection', client => {
    console.log('connection', client)
  client.on('event', data => { 
      /* … */
      console.log('event',data)
     });
  client.on('disconnect', () => { 
      /* … */
      console.log('disconnect', data)
     });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});