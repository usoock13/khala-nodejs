// const express = require('express');
import express from 'express';
const router = express.Router();
const request = require('request');

import { User, UserConfig } from './User.js';
import { Room } from './Room.js';

function CreateRoom(): string /* 방번호 */ {
    let myRoom = new Room();
    // 생성된 방의 roomNumber를 반환
    
    // 대입된 roomNumber를 반환
    return myRoom.GetRoomNumber();
}

// /room GET 통신 Router >>
router.get('/', (req: any, res: any) => {
    res.render('room', {
        name: 'usoock'
    });
})
router.post('/', (req: any, res: any) => {
    res.render('room', {
        name: 'usoock'
    });
})

const iconv = require('iconv-lite');
// room.ejs와 socket통신하는 모든 처리를 통괄
const RoomSocket = (io: any) => {
    const rs = io.of('/room');
    rs.on('connection', (socket: any) =>{
        socket.emit('require:userinfo', socket.id);
        socket.on('send:userinfo', (data: string) => {
            let userConfig: UserConfig = {
                ...JSON.parse(JSON.parse(data).userConfig),
                session: socket.id
            }
            let targetRoom = Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber);
            targetRoom.AddUser(new User(userConfig));
            console.log(`User Connected to ${targetRoom.roomNumber} room.`)
            
            socket.emit('user:enter', userConfig);
        });

        socket.on('disconnect', () => {
            let exitUser: User = User.allUsers.filter(user => user.session === socket.id)[0];
            let roomsNumberForRemove = Room.GetRoomForUser(exitUser);
            roomsNumberForRemove.forEach(room => {
                Room.RemoveRoom(room.roomNumber);
                console.log(`User disconnected from ${room.roomNumber} room.`);
            })
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

module.exports = {
    router: router,
    RoomSocket: RoomSocket,
    CreateRoom: CreateRoom,
};