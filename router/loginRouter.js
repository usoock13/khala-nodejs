const express = require('express');
const router = express.Router();
const { DDBLogin } = require('./dynamoDB');
const crypto = require('crypto');

router.get('/', (req, res) => {
    res.render('login.ejs', { cookie : req.headers.cookie });
})

router.post('/', (req, res) => {
    if(
        // ID 또는 Passwor 공백 입력 체크
        req.headers["user-id"] !== crypto.createHash('sha512').update('khala').digest('') && 
        req.headers["user-password"] !== crypto.createHash('sha512').update('khala').digest('')
    ){
        const params = {
            id: req.headers["user-id"],
            password: req.headers["user-password"],
        }
        DDBLogin(params)
    } else {
        console.error('No ID or Password was entered.')
    }
})

module.exports = router;