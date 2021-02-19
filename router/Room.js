"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
var User_js_1 = require("./User.js");
var Room = /** @class */ (function () {
    function Room() {
        this.users = new Array();
        this.lastChatUser = new User_js_1.User();
        var number;
        do {
            number = Math.random();
        } while (number === 0 || !!Room.GetRoomForRoomNumber(number.toString()));
        {
            number = Math.random();
        }
        number = Number((number.toString()).split('.')[1]);
        this.roomNumber = number.toString();
        Room.rooms.push(this);
        console.log("Room is Created / room number : " + this.roomNumber);
    }
    Room.GetRoomForRoomNumber = function (roomNumber) {
        return Room.rooms.filter(function (room) { return room.roomNumber == roomNumber; })[0];
    };
    Room.RemoveRoom = function (roomNumber) {
        var newRooms = this.rooms.filter(function (room) { return room.roomNumber !== roomNumber; });
        this.rooms = newRooms.concat();
        console.log("Room was destroyed, because all user in the room leave the room.");
    };
    Room.GetRoomForUser = function (user) {
        var result = this.rooms.filter(function (room) {
            if (room.users.includes(user))
                return room;
        });
        return result;
    };
    Room.prototype.GetLanguageTypes = function () {
        var result = Array();
        this.users.forEach(function (user) {
            if (!result.includes(user.language)) {
                result.push(user.language);
            }
        });
        return result;
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
exports.Room = Room;
//# sourceMappingURL=Room.js.map