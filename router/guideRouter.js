const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('guide.ejs', { cookie : req.headers.cookie })
})

module.exports = router;