"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(config) {
        this.nickname = config && config.nickname || '';
        this.language = config && config.language || '';
        this.avatar = config && config.avatar || 0;
        this.session = config && config.session || '';
        User.allUsers.push(this);
    }
    User.GetUserForSession = function (session) {
        var result;
        this.allUsers.forEach(function (user) {
            if (user.session === session)
                result = user;
        });
        return result;
    };
    User.allUsers = new Array();
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map