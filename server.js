const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

const tasks = ['hehe', 'haha'];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('updateData', (tasks) => {
    socket.broadcast.emit('updateData', tasks);
  });

  socket.on('removeTask', (task) => {
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    socket.broadcast.emit('updateData', tasks);
  });

  socket.on('addTask', (task) => {
    tasks.push(task)
    socket.broadcast.emit('updateData', tasks);
      
  });

  socket.on('disconnect', () => { 
    console.log('Oh, socket ' + socket.id + ' has left') 
    
  });
  console.log('I\'ve added a listener on message event \n');
});
