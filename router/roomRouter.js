"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var request = require('request');
var Room = /** @class */ (function () {
    function Room() {
        var number;
        do
            number = Math.random();
        while (number === 0);
        number = Math.random();
        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number;
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    Room.prototype.GetRoomNumber = function () {
        return this.roomNumber;
    };
    return Room;
}());
// /room GET 통신 Router >>
router.get('/', function (req, res) {
    res.render('room', {
        name: 'usoock'
    });
    console.log(req.session);
});
// room.ejs와 socket통신하는 모든 처리를 통괄
var RoomSocket = function (io) {
    io.on('connection', function (socket) {
        socket.on('create-room', function (msg) {
            // socket.emit('create-room', socket.handshake.session);
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
var rooms = new Array();
function CreateRoom() {
    // PapagoNow({
    //     so: 'ko',
    //     ta: 'en',
    //     text: '파파고 나우 프로젝트',
    // })
    rooms.push(new Room());
}
module.exports = {
    router: router,
    RoomSocket: RoomSocket,
    CreateRoom: CreateRoom,
};
//# sourceMappingURL=roomRouter.js.map