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
        } while (number === 0 || !!Room.GetRoomForRoomNumber(number));
        {
            number = Math.random();
        }
        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number;
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    Room.GetRoomForRoomNumber = function (roomNumber) {
        return Room.rooms.filter(function (room) { return room.roomNumber == roomNumber; })[0];
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
function CreateRoom() {
    var myRoom = new Room();
    // 생성된 방의 roomNumber를 선언
    var roomNumber = myRoom.GetRoomNumber();
    // return보다 rooms.push가 먼저 처리됨에 주의
    Room.rooms.push(myRoom);
    // 대입된 roomNumber를 반환
    return roomNumber;
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
    // console.log(req.get('Cookie'));
    console.log(req.get('Content-Type'));
    console.log(req.get('Cookie'));
});
var iconv = require('iconv-lite');
// room.ejs와 socket통신하는 모든 처리를 통괄
var RoomSocket = function (io) {
    io.on('connection', function (socket) {
        socket.emit('require:userinfo', socket.id);
        socket.on('send:userinfo', function (data) {
            var userConfig = __assign(__assign({}, JSON.parse(JSON.parse(data).userConfig)), { session: socket.id });
            Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber).AddUser(userConfig);
            console.log(Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber));
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