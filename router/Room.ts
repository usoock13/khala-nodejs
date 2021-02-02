import { User } from './User.js';

export class Room {
    public roomNumber: string;
    public users: User[] = new Array<User>();
    static rooms: Room[] = new Array<Room>();

    constructor() {
        let number: number;
        do {
            number = Math.random();
        } while (number===0 || !!Room.GetRoomForRoomNumber(number.toString()) ) {
            number = Math.random();
        }

        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number.toString();
        Room.rooms.push(this);
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    static GetRoomForRoomNumber(roomNumber: string) {
        return Room.rooms.filter(room => room.roomNumber==roomNumber)[0];
    }
    static RemoveRoom(roomNumber: string) {
        let newRooms: Room[] = this.rooms.filter(room => room.roomNumber!==roomNumber);
        this.rooms = newRooms.concat();
        console.log(`Room was destroyed, because all user in the room leave the room.`);
    }
    static GetRoomForUser(user: User): Room[] {
        let result = this.rooms.filter(room => {
            if(room.users.includes(user)) return room;
        })
        return result;
    }
    GetLanguageTypes(): string[] {
        let result = Array<string>();
        this.users.forEach(user => {
            if(!result.includes(user.language)){
                result.push(user.language);
            }
        })
        return result;
    }
    GetRoomNumber() : string {
        return this.roomNumber;
    }
    AddUser(user: User) {
        this.users.push(user);
    }
    RemoveUser(session: string){
        this.users = this.users.filter(user => user.session!==session);
    }
}