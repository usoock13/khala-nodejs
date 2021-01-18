const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', { name: null });
})

router.post('/', (req, res) => {
    console.dir(req.headers);
})

module.exports = router;