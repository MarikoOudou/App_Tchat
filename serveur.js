const express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = 3000
// const nowjs = require("now");
// var everyone = nowjs.initialize(server);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
});

io.on('connection', client => {
    console.log('connection du client ------------------------')
  client.on('event', data => { 
      console.log('event',data)
     });
  client.on('disconnect', () => { 
      console.log('disconnect', data)
     });
});


server.listen(port, ()=>{
    console.log("Le serveur ecout sur le port", port, "--------------")
});