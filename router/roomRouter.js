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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var request = require('request');
var User_js_1 = require("./User.js");
var Room_js_1 = require("./Room.js");
var papago_js_1 = require("./papago.js");
function CreateRoom() {
    var myRoom = new Room_js_1.Room();
    // 생성된 방의 roomNumber를 반환
    // 대입된 roomNumber를 반환
    return myRoom.GetRoomNumber();
}
// /room GET 통신 Router >>
router.get('/', function (req, res) {
    res.render('room', {
        name: 'usoock'
    });
});
router.post('/', function (req, res) {
    res.render('room', {
        name: 'usoock'
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
            var targetRoom = Room_js_1.Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber);
            socket.join(JSON.parse(data).roomNumber);
            // 방 번호로 검색한 결과, 해당하는 방이 있을 경우
            if (targetRoom) {
                targetRoom.AddUser(new User_js_1.User(userConfig));
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
            var exitUser = User_js_1.User.allUsers.filter(function (user) { return user.session === socket.id; })[0];
            var roomsNumberForRemove = Room_js_1.Room.GetRoomForUser(exitUser);
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
                    var destroyTimeout = setTimeout(function (temp) {
                        console.log(temp);
                        Room_js_1.Room.RemoveRoom(room.roomNumber);
                    }, DELAY_TO_DESTROY);
                    roomsWatingForDestroy.push({ timeout: destroyTimeout, roomNumber: room.roomNumber });
                }
            });
        });
        // 사용자가 보낸 메세지 처리 핸들러 >>
        socket.on('send:user-message', function (msg) {
            var user = User_js_1.User.GetUserForSession(socket.id);
            if (user) {
                var room = Room_js_1.Room.GetRoomForUser(user)[0];
                rs.to(room.roomNumber).emit('response:user-message', user, msg);
                console.log(room.GetLanguageTypes());
                papago_js_1.Translate({ sourceLang: 'ko', targetLang: 'en', query: msg });
            }
            else {
                console.error('This user is who? Not found this man.');
            }
        });
    });
};
// 번역 REST API 통신
function PapagoNow(params) {
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
    }, function (error, res, body) {
        if (error) {
            console.error(error);
        }
        console.dir("res : " + res);
        console.log("body : " + body);
    });
}
module.exports = {
    router: router,
    RoomSocket: RoomSocket,
    CreateRoom: CreateRoom,
};
//# sourceMappingURL=roomRouter.js.map