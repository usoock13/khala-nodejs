import express from 'express';
const router = express.Router();
const request = require('request');

import { User, UserConfig } from './User.js';
import { Room } from './Room.js';
import { Papago } from './papago.js';

let isDeadPapago = false;

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
    // 사용자가 모두 퇴장할 경우 해당 방을 등록할 변수. 지연시간동안 새로운 유저가 입장할 경우 방 파괴를 취소
    let roomsWatingForDestroy: any[] = [];
    rs.on('connection', (socket: any) =>{
        // User Info (khala-config) 요청
        socket.emit('require:userinfo', socket.id);
        
        // 사용자(Client)가 Usre info 요청에 정상적으로 응답하였을 경우, 입창 처리 핸들러
        socket.on('send:userinfo', (data: string) => {
            if(!JSON.parse(JSON.parse(data).userConfig)) return;
            let userConfig: UserConfig = {
                ...JSON.parse(JSON.parse(data).userConfig),
                session: socket.id
            }
            // 사용자가 보낸 방 번호(url의 parameter)로 방을 검색
            let targetRoom = Room.GetRoomForRoomNumber(JSON.parse(data).roomNumber);
            socket.join(JSON.parse(data).roomNumber);
            
            // 방 번호로 검색한 결과, 해당하는 방이 있을 경우
            if(targetRoom){
                targetRoom.AddUser(new User(userConfig));
                rs.to(targetRoom.roomNumber).emit('user:enter', targetRoom.users, userConfig);
                roomsWatingForDestroy.forEach(item => {
                    if (item.roomNumber === targetRoom.roomNumber) clearTimeout(item.timeout)
                })
                console.log(`User Connected to ${targetRoom.roomNumber} room.`)
            } else {
                socket.emit('not-exist-room');
            }
        });

        // 사용자 연결 끊김 이벤트 핸들러 >>
        socket.on('disconnect', () => {
            let exitUser: User = User.allUsers.filter(user => user.session === socket.id)[0];
            let roomsNumberForRemove = Room.GetRoomForUser(exitUser);
            // 방에서 사용자를 제거. 큰일이 있지 않은 이상 반환된 배열의 길이는 1일 것.
            roomsNumberForRemove.forEach(room => {
                // 방에서 exitUser에 해당하는 User를 제거
                room.RemoveUser(exitUser.session);
                // socket.io의 room에서도 해당 세션을 제거
                socket.leave(room.roomNumber);
                // 방에 남은 유저와 나간 유저를 남은 사용자들에게 전달
                rs.to(room.roomNumber).emit('response:user-leave', room.users, exitUser);
                console.log(`User disconnected from ${room.roomNumber} room.`);
                // 방에 남은 인원이 없을 경우
                if(room.users.length <=0){
                    // 잠깐의 지연시간을 가진 뒤 해당 방을 제거
                    const DELAY_TO_DESTROY = 5000;
                    const destroyTimeout = setTimeout(() => {
                        Room.RemoveRoom(room.roomNumber);
                    }, DELAY_TO_DESTROY);
                    roomsWatingForDestroy.push({ timeout: destroyTimeout, roomNumber: room.roomNumber });
                }
            })
        })

        // 사용자가 보낸 메세지 처리 핸들러 >>
        socket.on('send:user-message', async (msg: string) => {
            const user: any = User.GetUserForSession(socket.id);
            if(user){
                // 메세지를 전송한 사용자의 정보를 바탕으로 해당 메세지가 전송된 방을 반환함
                const room : Room = Room.GetRoomForUser(user)[0];
                // 방에 접속한 유저들이 사용하는 언어들의 목록을 반환하는 메서드 > GetLanguageTypes
                const targetLanguages = room.GetLanguageTypes();
                
                // 각  
                let translatedMsg: any = await Translate(user, msg, targetLanguages);
                console.log(translatedMsg);

                // 전송할 데이터의 Payload. 원래의 메세지와 유저, 번역된 메세지(들)와 대상 언어(들)가 탑재.
                const payload = {
                    orgMsg: msg,
                    orgUser: user,
                    targetLanguages: targetLanguages,
                    translatedMessages: translatedMsg
                }
                
                // 같은 방에 있는 사용자에게 메세지 전송
                rs.to(room.roomNumber).emit('response:user-message', user, payload);
            } else {
                console.error('This user is who? Not found this man.');
            }
        })
    })
}

function Translate(orgUser: User, orgMsg: string, langTypes: Array<string>) {
    return new Promise(async (resolve) => {
        let array: any = [];
        if(!isDeadPapago){
            for(const lang of langTypes){
                console.log(lang);
                // 메세지를 보낸 사용자의 언어로는 번역하지 않음
                if (lang !== orgUser.language) {
                    const params = {
                        sourceLang: orgUser.language,
                        targetLang: lang,
                        query: orgMsg
                    }
                    await Papago(params)
                    .then((res: any) => {
                        const result = JSON.parse(res).message.result;
                        array.push({ type: result.tarLangType, msg: result.translatedText });
                    });
                }
            }
        }
        resolve(array);
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