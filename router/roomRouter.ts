// const express = require('express');
import express from 'express';
const router = express.Router();
const request = require('request');
import cookie from 'cookie';

interface UserConfig {
    nickname: string;
    language: string;
    avatar: number;
    session: string;
}
class User {
    public nickname: string;
    public language: string;
    public avatar: number;
    public session: string;

    static allUsers: User[] = new Array<User>();

    constructor(config: UserConfig){
        console.log(config);
        this.nickname = config.nickname;
        this.language = config.language;
        this.avatar = config.avatar;
        this.session = config.session;
    }
    static GetUserForSession(session: string) {
        this.allUsers.forEach(user => {
            if(user.session === session) return user;
        })
        return null;
    }
}

class Room {
    public roomNumber: number;
    public users: User[] = new Array<User>();
    static rooms: Room[] = new Array<Room>();

    constructor() {
        let number: number;
        do {
            number = Math.random();
        } while (number===0 || !!Room.GetRoomForRoomNumber(number) ) {
            number = Math.random();
        }

        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number;
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    static GetRoomForRoomNumber(roomNumber: number) {
        return Room.rooms.filter(room => room.roomNumber==roomNumber)[0];
    }
    GetRoomNumber() : number {
        return this.roomNumber;
    }
    AddUser(user: User) {
        this.users.push(user);
    }
    RemoveUser(session: string){
        this.users = this.users.filter(user => user.session!==session);
    }
}

function CreateRoom(): number /* 방번호 */ {
    let myRoom = new Room();
    // 생성된 방의 roomNumber를 선언
    let roomNumber = myRoom.GetRoomNumber();
    // return보다 rooms.push가 먼저 처리됨에 주의
    Room.rooms.push(myRoom);
    // 대입된 roomNumber를 반환
    return roomNumber;
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
    // console.log(req.get('Cookie'));
    console.log(req.get('Content-Type'));
    console.log(req.get('Cookie'));
})

const iconv = require('iconv-lite');
// room.ejs와 socket통신하는 모든 처리를 통괄
const RoomSocket = (io: any) => {
    io.on('connection', function(socket: any){
        socket.emit('require:userinfo', socket.id);
        socket.on('send:userinfo', (data: string) => {
            let userConfig: UserConfig = {
                ...JSON.parse(JSON.parse(data).userConfig),
                session: socket.id
            }
            Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber).AddUser(userConfig);
            console.log( Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber) );
        });
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