const express = require('express');
const router = express.Router();
const SERVER_CONFIG = require('../server-config.json');
const { CreateRoom } = require('./roomRouter');

router.get('/', (req, res) => {
    res.render('create-room', {name: 'usoock'});
})
router.post('/', (req, res) => {
    console.dir(req.body);
    CreateRoom();
})

module.exports = router;