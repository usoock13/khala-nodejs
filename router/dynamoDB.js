const AWS = require("aws-sdk");
const { param } = require("./loginRouter");
const dotenv = require('dotenv');
const crypto = require('crypto');
const { sendDataToProcessId } = require("pm2");
const nodemailer = require('nodemailer');
dotenv.config();


AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: 'https://dynamodb.ap-northeast-2.amazonaws.com'
})

const docClient = new AWS.DynamoDB.DocumentClient();

exports.DDBLogin = (data, res) => {
    try {
        if(data.id.search(/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/) < 0) {
            console.error('The ID used by KHALA is in email format.');
            throw new Error('The ID used by KHALA is in email format.');
        }
        if(data.password.length < 8){
            console.error('Password must be at least 8 characters long.');
            throw new Error('Password must be at least 8 characters long.');
        }
        if(data.password.length > 24){
            console.error('I think a password with more than 24 characters is a little too much :)');
            throw new Error('I think a password with more than 24 characters is a little too much :)');
        }
        if(data.password.search(/[0-9]/g) < 0){
            console.error('Password must contain a number!');
            throw new Error('Password must contain a number!');
        }
        if(data.password.search(/[a-z]/ig) < 0){
            console.error('The password must include English, too!');
            throw new Error('The password must include English, too!');
        }
        if(data.password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi) < 0){
            console.error('Password must also contain special characters!');
            throw new Error('Password must also contain special characters!');
        }
        const params = {
            TableName : 'khala-user',
            Item: {
                'email': data.id,
                'password': crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.password),
            }
        }
    } catch(e) {
        console.dir(e.message);
        res.status(401).json({
            status: 401,
            message: e.message
        });
    }
}

exports.DDBSignUp = (data, res) => {
    try {
        if(data.id.search(/^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/) < 0) {
            console.error('The ID used by KHALA is in email format.');
            throw new Error('The ID used by KHALA is in email format.');
        }
        if(data.password.length < 8){
            console.error('Password must be at least 8 characters long.');
            throw new Error('Password must be at least 8 characters long.');
        }
        if(data.password.length > 24){
            console.error('I think a password with more than 24 characters is a little too much :)');
            throw new Error('I think a password with more than 24 characters is a little too much :)');
        }
        if(data.password.search(/[0-9]/g) < 0){
            console.error('Password must contain a number!');
            throw new Error('Password must contain a number!');
        }
        if(data.password.search(/[a-z]/ig) < 0){
            console.error('The password must include English, too!');
            throw new Error('The password must include English, too!');
        }
        if(data.password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi) < 0){
            console.error('Password must also contain special characters!');
            throw new Error('Password must also contain special characters!');
        }
        const authNumber = Math.random().toString(36).substr(2, 11);
        const params = {
            TableName : "khala-user",
            Item: {
                'email': data.id,
                'password': crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.password),
                'nickname': data.nickname,
                'authNumber': authNumber,
                'hadConfirmed': false
            }
        }
        docClient.put(params, (err, result) => {
            if (err) {
                console.error(err);
            } else {
                SendMail(data.id, { authNumber })
                res.status(200).json({
                    status: 200,
                    message: 'user item added',
                    redirection: '/sign-up/result'
                })
            }
        })
    } catch(e) {
        console.dir(e.message);
        res.status(401).json({
            status: 401,
            message: e.message,
        });
    }
}

const SendMail = async (email, params) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    })
    let info = await transporter.sendMail({
        from: `"KHALA" <${process.env.NODEMAILER_USER}>`,
        to: email,
        subject: "KHALA Auth Mail - Hello ~?",
        text: '',
        html: `
            <h3>Thank you for join us!</h3>
            <p>
                I'm so happy to be with you! <br>
                Below is the code required for authentication.
            </p>
            <h1>${params.authNumber}</h1>
        `
    })
}