const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('room', {name: 'usoock'});
})

module.exports = router;