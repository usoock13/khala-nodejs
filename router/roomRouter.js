const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('room', {
        name: 'usoock'
    });
    console.log(req.session);
})

const roomSocket = (io) => {
    io.on('connection', function(socket){
        socket.on('create-room', function(msg){
            // console.log(socket.handshake.session);
            socket.emit('create-room', socket.handshake.session);
        })
    })
}

module.exports = {
    router: router,
    roomSocket: roomSocket
};