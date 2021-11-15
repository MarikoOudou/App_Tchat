const express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const port = 3000

app.use(express.static(__dirname + '/public'));

users = []
rooms = [
    {
        value: "Salle 1",
        name: "Salle 1"
    },
    {
        value: "Salle 2",
        name: "Salle 2"
    },
    {
        value: "Salle 3",
        name: "Salle 3"
    },
]

io.on('connection', socket => {
    // console.log('connection du client ------------------------', socket.client.id)

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        console.log({ username, room })
        socket.join(user.room);
    
        // Welcome current user
        socket.emit('message', formatMessage("Serveur", 'Bienvenu dans la conversation!'));
    
        // Broadcast when a user connects
        /*socket.broadcast
          .to(user.room)
          .emit(
            'message',
            formatMessage(botName, `${user.username} has joined the chat`)
          );*/
    
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      });

      
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });


  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("Serveur", `${user.username} vient de se deconnecter`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });

    socket.on('login', user => { 
        user.id = socket.client.id
        users.push(user)
        console.log('users : ',users)

        if (users) {
            socket.emit('login', {
                server: 'Client connecté',
                users,
                user
            })
        }
     });

     // send rooms
     socket.emit("sendRooms", rooms);

     socket.on('addroom', addRoom => { 
       console.log("addroom", addRoom)
       rooms.push(addRoom)
       console.log(rooms)
        // user.id = socket.client.id
        /*rooms.find( room => {
            if (room.id == addUser.id) {
                room.users.push(addUser.user)
            }
        })
        console.log('room add user : ', addUser.user)
        console.log('room user : ', rooms[0].users)

        if (addUser.user) {
            io.sockets.emit('addroom', {
                response: 'ajout dans une salle',
                room: rooms.find( room  => {
                    if (room.id == addUser.id) {
                        return room
                    }
                }),
                user: addUser.user,
            })
        }*/
     });


/*
     socket.on('newmsg', msg => { 

        console.log("new message :", msg.message)
        console.log("user :", msg.user)
        console.log("room :", msg.room)

     });

     socket.on('disconnect', (data) => { 
      console.log('disconnect', data)
     });*/
});


server.listen(port, ()=>{
    console.log("Le serveur ecout sur le port", port, "--------------")
});