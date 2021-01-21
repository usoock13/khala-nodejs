"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var request = require('request');
var User = /** @class */ (function () {
    function User(config) {
        console.log(config);
        this.nickname = config.nickname;
        this.language = config.language;
        this.avatar = config.avatar;
        this.session = config.session;
    }
    User.GetUserForSession = function (session) {
        this.allUsers.forEach(function (user) {
            if (user.session === session)
                return user;
        });
        return null;
    };
    User.allUsers = new Array();
    return User;
}());
var Room = /** @class */ (function () {
    function Room() {
        this.users = new Array();
        var number;
        do {
            number = Math.random();
        } while (number === 0 || Room.GetRoomForRoomNumber(number) !== null);
        {
            number = Math.random();
        }
        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number;
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    Room.GetRoomForRoomNumber = function (roomNumber) {
        Room.rooms.forEach(function (room) {
            if (room.roomNumber === roomNumber)
                return room;
        });
        return null;
    };
    Room.prototype.GetRoomNumber = function () {
        return this.roomNumber;
    };
    Room.prototype.AddUser = function (user) {
        this.users.push(user);
    };
    Room.prototype.RemoveUser = function (session) {
        this.users = this.users.filter(function (user) { return user.session !== session; });
    };
    Room.rooms = new Array();
    return Room;
}());
// /room GET 통신 Router >>
router.get('/', function (req, res) {
    res.render('room', {
        name: 'usoock'
    });
    console.log(req.get('Cookie'));
});
var iconv = require('iconv-lite');
// room.ejs와 socket통신하는 모든 처리를 통괄
var RoomSocket = function (io) {
    io.on('connection', function (socket) {
        var nickname = JSON.parse(socket.handshake.cookies['khala-config']).nickname;
        console.log(nickname);
        var temp = iconv.encode(nickname, 'utf8');
        console.log(iconv.decode(temp, 'win1251'));
        // console.log(iconv.decode(iconv.encode('하마텍션디스크레인지럽스', 'utf-8'), 'utf8'));
        // console.log( iconv.decode(temp, 'utf8') );
        socket.emit('req', socket.handshake.cookies);
        socket.on('res', function (data) {
            // console.log(data);
        });
        // socket.on('response userinfo', 'test');
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
function CreateRoom(host) {
    var myRoom = new Room();
    Room.rooms.push(myRoom);
    // 생성된 roomNumber를 반환
    return myRoom.GetRoomNumber();
}
module.exports = {
    router: router,
    RoomSocket: RoomSocket,
    CreateRoom: CreateRoom,
};
//# sourceMappingURL=roomRouter.js.map