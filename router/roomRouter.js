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
var User_js_1 = require("./User.js");
var Room_js_1 = require("./Room.js");
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
    rs.on('connection', function (socket) {
        socket.emit('require:userinfo', socket.id);

        socket.on('send:userinfo', function (data) {
            var userConfig = __assign(__assign({}, JSON.parse(JSON.parse(data).userConfig)), { session: socket.id });
            var targetRoom = Room_js_1.Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber);
            
            if(targetRoom){
                targetRoom.AddUser(new User_js_1.User(userConfig));
                socket.join(targetRoom.roomNumber);
                console.log('User Connected to ' + targetRoom.roomNumber + ' room.');

                console.log(targetRoom.users);
                rs.to(targetRoom.roomNumber).emit('user:enter', userConfig);
            } else {
                console.log('User attempts to connect to a room that does not exist.')
                socket.emit('not-exist-room');
            }
        });
        socket.on('disconnect', function () {
            var exitUser = User_js_1.User.allUsers.filter(function (user) { return user.session === socket.id; })[0];
            var roomsNumberForRemove = Room_js_1.Room.GetRoomForUser(exitUser);
            rs.emit('user:exit', exitUser);
            roomsNumberForRemove.forEach(function (room) {
                if(room.users.length <= 0) {
                    Room_js_1.Room.RemoveRoom(room.roomNumber);
                    console.log("User disconnected from " + room.roomNumber + " room.");
                }
            });
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