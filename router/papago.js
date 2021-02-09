"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translate = void 0;
var client_id = '4E43bHF19CmNyDd74lrv';
var client_secret = process.env.PAPAGO;
var Translate = function (_a) {
    var sourceLang = _a.sourceLang, targetLang = _a.targetLang, query = _a.query;
    var request = require('request');
    var apiUrl = 'https://openapi.naver.com/v1/papago/n2mt';
    var parameters = {
        url: apiUrl,
        form: {
            'source': sourceLang,
            'target': targetLang,
            'text': query
        },
        headers: {
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret
        }
    };
    console.log(client_secret);
    return request.post(parameters, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            console.log("result: " + body);
        }
        else {
            console.error("error = " + res.statusCode);
            console.error(res.body);
        }
    });
};
exports.Translate = Translate;
/*
app.get('/translate', function (req, res) {
    const request = require('request');
    var options = {
        url: api_url,
        form: {'source':'ko', 'target':'en', 'text':query},
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
    request.post(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.end(body);
     } else {
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });
});
*/ 
//# sourceMappingURL=papago.js.map