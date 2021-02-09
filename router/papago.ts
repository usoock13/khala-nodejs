var client_id = '4E43bHF19CmNyDd74lrv';
var client_secret = process.env.PAPAGO;

interface papagoProps {
    sourceLang: string,
    targetLang: string,
    query: string
}
export const Translate = ({ sourceLang, targetLang, query }: papagoProps) => {
    const request = require('request');
    var apiUrl = 'https://openapi.naver.com/v1/papago/n2mt';
    const parameters = {
        url: apiUrl,
        form: {
            'source': sourceLang,
            'target': targetLang,
            'text':query
        },
        headers: {
            'X-Naver-Client-Id': client_id,
            'X-Naver-Client-Secret': client_secret
        }
    };
    console.log(client_secret);
    return request.post(parameters, (err: any, res: any, body: any) => {
        if (!err && res.statusCode == 200) {
            console.log(`result: ${body}`);
        } else {
            console.error(`error = ${res.statusCode}`);
            console.error(res.body);
        }
    })
}
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