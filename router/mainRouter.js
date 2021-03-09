const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main', { cookie: req.headers.cookie });
})

module.exports = router;