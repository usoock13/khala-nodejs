const AWS = require("aws-sdk");
const { param } = require("./loginRouter");
const dotenv = require('dotenv');
const crypto = require('crypto');
dotenv.config();


AWS.config.update({
    region: 'ap-northeast-2',
    endpoint: 'https://dynamodb.ap-northeast-2.amazonaws.com'
})

const docClient = new AWS.DynamoDB.DocumentClient();

exports.DDBLogin = (data) => {
    const hashData = {
        id: crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.id),
        password: crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.password),
    }
    const params = {
        TableName : 'khala-user',
        Item: {
            'email': hashData.id,
            'password': hashData.password
        }
    }
}

exports.DDBSignUp = (data) => {
    const hashData = {
        id: data.id,
        nickname: data.nickname,
        password: crypto.createHash('sha512').update(process.env['HASH_SALT']).digest(data.password),
    }
    const params = {
        TableName : "khala-user",
        Item: {
            'email': hashData.id,
            'password': hashData.password,
            'nickname': hashData.nickname
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
        }
    })
}