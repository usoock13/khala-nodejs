const path = require('path');
const express = require('express');
const app = express();
const PORT_NUMBER = 2022;

const router = {
  main: require('./router/main'),
  room: require('./router/room'),
  setting: require('./router/setting'),
}

app.use(express.static(__dirname + '/static'));
app.set('view engine', 'ejs');

app.use('/', router.main);
app.use('/room', router.room);
app.use('/setting', router.setting);

// app.get('/', (req, res) => {
//     res.render('main', {name:'usoock'});
// })

app.listen(PORT_NUMBER, () => {
  console.log(`[Firebase-Project for Express] app started on port ${PORT_NUMBER}`);
})