const express = require('express');
const router = express.Router();
const SERVER_CONFIG = require('../server-config.json');
const { CreateRoom } = require('./roomRouter');

router.get('/', (req, res) => {
    res.render('create-room', {name: 'usoock'});
})
router.post('/', (req, res) => {
    res.redirect('/room?room-no='+CreateRoom());
})

module.exports = router;