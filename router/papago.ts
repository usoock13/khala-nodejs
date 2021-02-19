var client_id = '4E43bHF19CmNyDd74lrv';
// var client_secret = process.env.PAPAGO;
var client_secret = "temtemporary";

interface papagoProps {
    sourceLang: string,
    targetLang: string,
    query: string
}
export const Papago = ({ sourceLang, targetLang, query }: papagoProps) => {
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
    return new Promise(function(resolve) {
        request.post(parameters, (err: any, res: any, body: any) => {
            if (!err && res.statusCode == 200) {
                resolve(res.body);
            } else {
                console.error(`error = ${res.statusCode}`);
                resolve(new Error("Papago was dead..."));
            }
        })
    })
}