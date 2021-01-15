const path = require('path');
const express = require('express');
const session = require('express-session')({
  secret: "usoock",
  resave: false,
  saveUninitialized: true
});
const app = express();
const PORT_NUMBER = 2022;

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ioSession = require('express-socket.io-session');

const router = {
  main: require('./router/mainRouter'),
  room: require('./router/roomRouter').router,
  createRoom: require('./router/create-room'),
  setting: require('./router/settingRouter'),
}
// 외부에 선언된 roomSocket 메서드를 import. 
// 인자로 io를 받는 메서드. room의 socket통신을 총괄 담당
const { roomSocket } = require('./router/roomRouter');

app.use(express.static(__dirname + '/static'));
app.use(session);
app.set('view engine', 'ejs');

io.use(ioSession(session, { autoSave: true }));

app.use('/', router.main);
app.use('/room', router.room);
app.use('/create-room', router.createRoom);
app.use('/setting', router.setting);

// import한 roomSocket을 실행. import단에서,
//   const roomSocket = require('./router/room').roomSocket(io);
// 위와 같이 실행과 선언을 동시에 처리할 수도 있다
roomSocket(io);

server.listen(PORT_NUMBER, () => {
  console.log(`[Firebase-Project for Express] app started on port ${PORT_NUMBER}`);
})