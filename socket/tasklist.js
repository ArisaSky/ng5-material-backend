// express
const express = require('express');
const router = express.Router();
var returnRouter = function(io) {
  // socket
  let totalConnections = 0;
  io.on('connection', function(socket) {
    totalConnections++;
    console.log('Socket connection initialized. Currently (' + totalConnections + ') Connected.');
    socket.on('disconnect', function(res) {
      totalConnections--;
      console.log('Socket connection closed. Currently (' + totalConnections + ') Connected.');
    });

    socket.on('save-tasklist', function (res) {
      console.log(res);
      io.emit('new-tasklist',  res);
    });

    socket.on('delete-tasklist', function (res) {
      console.log(res);
      io.emit('remove-tasklist',  res);
    });

    socket.on('edit-tasklist', function (res) {
      console.log(res);
      io.emit('update-tasklist',  res);
    });
  });

  return router;
}

module.exports = returnRouter;