"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(config) {
        this.nickname = config.nickname;
        this.language = config.language;
        this.avatar = config.avatar;
        this.session = config.session;
        User.allUsers.push(this);
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
exports.User = User;
//# sourceMappingURL=User.js.map