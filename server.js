const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

const tasks = [];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/src')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/src/App.js'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.emit('updateData', tasks);

  socket.on('removeTask', ({task}) => {
    for(i = 0; i < tasks.length; i++) {
      if(tasks[i] === task) {
        tasks.splice(i, 1);
        socket.broadcast.emit('updateData', tasks);
      }
    }
  });

  socket.on('addTask', ({task}) => {
    tasks.push(task)
    socket.broadcast.emit('updateData', tasks);
      
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left') 
    for(i = 0; i < users.length; i++) {
      if(users[i].id === socket.id) {
        socket.broadcast.emit('message', {
          author: 'Chat Bot',
          content: `${users[i].name} has left the conversation...`,
        });
        users.splice(i, 1);
      }
    }
  });
  console.log('I\'ve added a listener on message event \n');
});
