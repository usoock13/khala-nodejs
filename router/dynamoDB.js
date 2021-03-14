const AWS = require("aws-sdk");
const { param } = require("./loginRouter");
const dotenv = require('dotenv');
const crypto = require('crypto');
const { sendDataToProcessId } = require("pm2");
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
        const hashData = {
            id: crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.id),
            password: crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.password),
        } // 암호화
        const params = {
            TableName : 'khala-user',
            Item: {
                'email': hashData.id,
                'password': hashData.password,
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
        const hashData = {
            id: data.id,
            nickname: data.nickname,
            password: crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.password),
        } // 암호화
        const params = {
            TableName : "khala-user",
            Item: {
                'email': hashData.id,
                'password': hashData.password,
                'nickname': hashData.nickname,
                'hadConfirmed': false
            }
        }
        docClient.put(params, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
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