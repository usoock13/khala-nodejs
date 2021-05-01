const express = require('express');
const router = express.Router();
const { DDBSignUp } = require('./dynamoDB');

router.get('/', (req, res) => {
    res.render('sign-up.ejs', { cookie : req.headers.cookie });
})
router.get('/result', (req, res) => {
    res.render('sign-up-result.ejs', { cookie : req.headers.cookie });
})

router.post('/', (req, res) => {
    const params = {
        id: req.headers["user-id"],
        password: req.headers["user-password"],
        nickname: req.headers["user-nickname"],
    }
    DDBSignUp(params, res);
})
router.post('/result', (req, res) => {
    const params = {
        code: req.headers["authentication-code"]
    }
    res.json({ content:"i dont care" });
    // DDBAuthenticate(params, res);
})

module.exports = router;