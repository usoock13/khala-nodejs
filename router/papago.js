"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Papago = void 0;
var client_id = '4E43bHF19CmNyDd74lrv';
var client_secret = process.env.PAPAGO;
var Papago = function (_a) {
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
    return new Promise(function (resolve, reject) {
        request.post(parameters, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                resolve(res.body);
            }
            else {
                console.error("error = " + res.statusCode);
                reject(new Error("Papago was dead..."));
            }
        });
    });
};
exports.Papago = Papago;
//# sourceMappingURL=papago.js.map