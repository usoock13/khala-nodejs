export interface UserConfig {
    nickname: string;
    language: string;
    avatar: number;
    session: string;
}
export class User {
    public nickname: string;
    public language: string;
    public avatar: number;
    public session: string;

    static allUsers: User[] = new Array<User>();

    constructor(config: UserConfig){
        this.nickname = config.nickname;
        this.language = config.language;
        this.avatar = config.avatar;
        this.session = config.session;

        User.allUsers.push(this);
    }
    static GetUserForSession(session: string) {
        let result;
        this.allUsers.forEach(user => {
            if(user.session === session) result = user;
        })
        return result;
    }
}
