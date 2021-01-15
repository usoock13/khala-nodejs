const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('main', {name:'usoock'});
})

module.exports = router;