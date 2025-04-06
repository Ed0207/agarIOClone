// create server
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const URL = 'https://agarioclone.onrender.com/';

const app = express();

// allow cross-origin sharing
app.use(cors({
  origin: URL, 
  methods: ['GET', 'POST']
}));

app.use(express.static(__dirname+ '/public'));
const expressServer = app.listen(process.env.PORT || 9000);
const io  = socketio(expressServer, cors({
  origin: URL, 
  methods: ['GET', 'POST']
}));

module.exports = {
    io,
    app
}