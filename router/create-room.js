const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('create-room', {name: 'usoock'});
})

module.exports = router;