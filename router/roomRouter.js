"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var request = require('request');
var User_1 = require("./User");
var Room_1 = require("./Room");
var papago_1 = require("./papago");
var papago_now_1 = require("./papago-now");
var isDeadPapago = false;
function CreateRoom() {
    var myRoom = new Room_1.Room();
    // 생성된 방의 roomNumber를 반환
    // 대입된 roomNumber를 반환
    return myRoom.GetRoomNumber();
}
// /room GET 통신 Router >>
router.get('/', function (req, res) {
    res.render('room', {
        cookie: req.headers.cookie
    });
});
router.post('/', function (req, res) {
    res.render('room', {
        cookie: req.headers.cookie
    });
});
var iconv = require('iconv-lite');
// room.ejs와 socket통신하는 모든 처리를 통괄
var RoomSocket = function (io) {
    var rs = io.of('/room');
    // 사용자가 모두 퇴장할 경우 해당 방을 등록할 변수. 지연시간동안 새로운 유저가 입장할 경우 방 파괴를 취소
    var roomsWatingForDestroy = [];
    rs.on('connection', function (socket) {
        // User Info (khala-config) 요청
        socket.emit('require:userinfo', socket.id);
        // 사용자(Client)가 Usre info 요청에 정상적으로 응답하였을 경우, 입창 처리 핸들러
        socket.on('send:userinfo', function (data) {
            if (!JSON.parse(JSON.parse(data).userConfig))
                return;
            var userConfig = __assign(__assign({}, JSON.parse(JSON.parse(data).userConfig)), { session: socket.id });
            // 사용자가 보낸 방 번호(url의 parameter)로 방을 검색
            var targetRoom = Room_1.Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber);
            socket.join(JSON.parse(data).roomNumber);
            // 방 번호로 검색한 결과, 해당하는 방이 있을 경우
            if (targetRoom) {
                targetRoom.AddUser(new User_1.User(userConfig));
                targetRoom.lastChatUser = new User_1.User();
                rs.to(targetRoom.roomNumber).emit('user:enter', targetRoom.users, userConfig);
                roomsWatingForDestroy.forEach(function (item) {
                    if (item.roomNumber === targetRoom.roomNumber)
                        clearTimeout(item.timeout);
                });
                console.log("User Connected to " + targetRoom.roomNumber + " room.");
            }
            else {
                socket.emit('not-exist-room');
            }
        });
        // 사용자 연결 끊김 이벤트 핸들러 >>
        socket.on('disconnect', function () {
            var exitUser = User_1.User.allUsers.filter(function (user) { return user.session === socket.id; })[0];
            var roomsNumberForRemove = Room_1.Room.GetRoomForUser(exitUser);
            // 방에서 사용자를 제거. 큰일이 있지 않은 이상 반환된 배열의 길이는 1일 것.
            roomsNumberForRemove.forEach(function (room) {
                // 방에서 exitUser에 해당하는 User를 제거
                room.RemoveUser(exitUser.session);
                // socket.io의 room에서도 해당 세션을 제거
                socket.leave(room.roomNumber);
                // 방에 남은 유저와 나간 유저를 남은 사용자들에게 전달
                rs.to(room.roomNumber).emit('response:user-leave', room.users, exitUser);
                console.log("User disconnected from " + room.roomNumber + " room.");
                // 방에 남은 인원이 없을 경우
                if (room.users.length <= 0) {
                    // 잠깐의 지연시간을 가진 뒤 해당 방을 제거
                    var DELAY_TO_DESTROY = 5000;
                    var destroyTimeout = setTimeout(function () {
                        Room_1.Room.RemoveRoom(room.roomNumber);
                    }, DELAY_TO_DESTROY);
                    roomsWatingForDestroy.push({ timeout: destroyTimeout, roomNumber: room.roomNumber });
                }
            });
        });
        // 사용자가 보낸 메세지 처리 핸들러 >>
        socket.on('send:user-message', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
            var user, room, targetLanguages, translatedMsg, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = User_1.User.GetUserForSession(socket.id);
                        if (!user) return [3 /*break*/, 2];
                        room = Room_1.Room.GetRoomForUser(user)[0];
                        targetLanguages = room.GetLanguageTypes();
                        return [4 /*yield*/, Translate(user, msg, targetLanguages)];
                    case 1:
                        translatedMsg = _a.sent();
                        payload = {
                            orgMsg: msg,
                            orgUser: user,
                            targetLanguages: targetLanguages,
                            translatedMessages: translatedMsg,
                            isSuccessive: room.lastChatUser.session === user.session
                        };
                        // 같은 방에 있는 사용자에게 메세지 전송
                        room.lastChatUser = user;
                        rs.to(room.roomNumber).emit('response:user-message', user, payload);
                        return [3 /*break*/, 3];
                    case 2:
                        console.error('This user is who? Not found this man.');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    });
};
function Translate(orgUser, orgMsg, langTypes) {
    var _this = this;
    return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var array, _i, langTypes_1, lang, params, params;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    array = [];
                    _i = 0, langTypes_1 = langTypes;
                    _a.label = 1;
                case 1:
                    if (!(_i < langTypes_1.length)) return [3 /*break*/, 6];
                    lang = langTypes_1[_i];
                    if (!(lang !== orgUser.language)) return [3 /*break*/, 5];
                    if (!!isDeadPapago) return [3 /*break*/, 3];
                    params = {
                        sourceLang: orgUser.language,
                        targetLang: lang,
                        query: orgMsg
                    };
                    // Papago REST API 실행
                    return [4 /*yield*/, papago_1.Papago(params)
                            .then(function (res) {
                            if (res instanceof Error) {
                                throw (res);
                            }
                            var parsingRes = JSON.parse(res).message.result;
                            array.push({ type: parsingRes.tarLangType, msg: parsingRes.translatedText });
                        })
                            .catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.error(err);
                                        // Papago REST API의 상태를 비정상으로 지정 (isDeadPapago)
                                        // 이후 REST API 실행 차단 및 대체코드 실행
                                        isDeadPapago = true;
                                        // PapagoNow를 초기화, 이후 대체코드에서는 translate() 메서드만 실행
                                        // (puppeteer 브라우저 실행)
                                        return [4 /*yield*/, papago_now_1.PapagoNow().init()];
                                    case 1:
                                        // PapagoNow를 초기화, 이후 대체코드에서는 translate() 메서드만 실행
                                        // (puppeteer 브라우저 실행)
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    // Papago REST API 실행
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!isDeadPapago) return [3 /*break*/, 5];
                    params = {
                        so: orgUser.language,
                        ta: lang,
                        text: orgMsg
                    };
                    return [4 /*yield*/, papago_now_1.PapagoNow().translate(params)
                            .then(function (res) {
                            var parsingRes = JSON.parse(res);
                            array.push({
                                type: parsingRes.tarLangType,
                                msg: parsingRes.translatedText
                            });
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    resolve(array);
                    return [2 /*return*/];
            }
        });
    }); });
}
// 번역 REST API 통신
/*
function PapagoNow(params: any){
    request.post({
        headers: {
            "Content-Type": "application/json",
        },
        url: "https://papago-now.herokuapp.com/translate",
        body: {
            "so": params.so,
            "ta": params.ta,
            "text": params.text
        },
        json: true
    }, function(error: any, res: any, body: Body) {
        if(error){
            console.error(error);
        }
        console.dir("res : " + res);
        console.log("body : " + body)
    })
}
*/
module.exports = {
    router: router,
    RoomSocket: RoomSocket,
    CreateRoom: CreateRoom,
};
//# sourceMappingURL=roomRouter.js.map