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
        } while (number===0 || Room.GetRoomForRoomNumber(number)!==null ) {
            number = Math.random();
        }

        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number;
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    static GetRoomForRoomNumber(roomNumber: number) {
        Room.rooms.forEach(room => {
            if(room.roomNumber === roomNumber) return room;
        });
        return null;
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

// /room GET 통신 Router >>
router.get('/', (req: any, res: any) => {
    res.render('room', {
        name: 'usoock'
    });
    console.log(req.get('Cookie'));
})

const iconv = require('iconv-lite');
// room.ejs와 socket통신하는 모든 처리를 통괄
const RoomSocket = (io: any) => {
    io.on('connection', function(socket: any){


        let nickname: string = JSON.parse(socket.handshake.cookies['khala-config']).nickname;
        console.log(nickname);
        let temp = iconv.encode(nickname, 'utf8');
        console.log(iconv.decode(temp, 'win1251'));
        // console.log(iconv.decode(iconv.encode('하마텍션디스크레인지럽스', 'utf-8'), 'utf8'));
        // console.log( iconv.decode(temp, 'utf8') );


        socket.emit('req', socket.handshake.cookies);
        socket.on('res', (data: string) => {
            // console.log(data);
        });
        // socket.on('response userinfo', 'test');
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

function CreateRoom(host: UserConfig): number /* 방번호 */ {
    let myRoom = new Room();
    Room.rooms.push(myRoom);
    // 생성된 roomNumber를 반환
    return myRoom.GetRoomNumber();
}

module.exports = {
    router: router,
    RoomSocket: RoomSocket,
    CreateRoom: CreateRoom,
};