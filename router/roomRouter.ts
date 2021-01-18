// const express = require('express');
import express from 'express';
const router = express.Router();
const request = require('request');

class Room {
    public roomNumber: number;
    constructor() {
        let number: number;
        do number = Math.random();
        while (number===0) number = Math.random();

        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number;
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    GetRoomNumber() : number {
        return this.roomNumber;
    }
}

// /room GET 통신 Router >>
router.get('/', (req: any, res: any) => {
    res.render('room', {
        name: 'usoock'
    });
    console.log(req.session);
})

// room.ejs와 socket통신하는 모든 처리를 통괄
const RoomSocket = (io: any) => {
    io.on('connection', function(socket: any){
        socket.on('create-room', function(msg: string){
            // socket.emit('create-room', socket.handshake.session);
        })
    })
}

// 번역 REST API 통신
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

let rooms: Room[] = new Array<Room>();

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