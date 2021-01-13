$(function() {
    let socket = io('https://khala-nodejs.herokuapp.com');
    // let socket = io('192.168.219.100:3999');
    let option = {
        user: {
            name: prompt('what is your name') || 'Legend Maker',
            lang: JSON.parse(localStorage.getItem('option')) || 'ko',
        }
    }
    
    // KHALA 초기화 >>
    $('.khala-userName').text(option.user.name);
    socket.on('send greeting', function(res) {
        AppendSystemMessage(`<p>Welcome, <span>${res.name}!</span></p>`);
    })
    socket.on('create id', function(res) {
        setCookie('socket.io-id', res, 1);
    })
    socket.on('temporary', function(res) {
        console.log(res);
    });
    // << KHALA 초기화

    socket.emit('send userinfo', option.user);
    
    // redundant connection 중복 접속 >>
    socket.on('redundant connection', function(message) {
        alert(message);
        window.opener='Self';
        window.open('','_parent','');
        window.close();
        window.open('about:blank','_self').self.close();
    });
    // << redundant connection 중복 접속

    // Handle submit Text >>
    $('.khala-input-form').submit(function(e) {
        e.preventDefault();
        let data = {
            srcLang: $('#user-lang input[name="lang"]:checked')[0].value,
            text: e.target.text.value
        }
        console.log(data);
        socket.emit('request message', data);
    })
    // << Handle submit Text

    // Enter 전송 처리 >>
    $('.khala-input-text').keydown(function(e){
        if(e.keyCode===13){
            e.preventDefault();
            $('.khala-input-form').submit();
            $('.khala-input-text').val('');
        }
    })
    // << Enter 전송 처리

    // Handle change lang >>
    $('#user-lang input[name="lang"]').change(function(e) {
        langCode = e.target.value;
        langName = e.target.labels[0].innerText;

        $('#user-lang .user-lang-selected').text(langName);
    })
    // << Handle change lang
    
    // send socket.io-id to server >>
    socket.on('request id', function() {
        socket.emit('response id', getCookie('socket.io-id'));
    })
    // << send socket.io-id to server

    socket.on('response message', function(res) {
        let data = res;
        console.log(data);
        AppendChat(data);
    });

    function AppendChat({ userId, username, message }) {
        let isMe = '';
        if(userId===getCookie('socket.io-id')){
            isMe = ' isMe'
        }
        let messageForm = `
            <li class="khala-redirection-item${isMe}">
                <h6 class="item-username">${username}</h6>
                <p class="item-contents">${message}</p>
            </li>
        `
        $('.khala-redirection-list').append(messageForm)
        $('.khala-redirection').scrollTop($('.khala-redirection').height());
    }
    function AppendSystemMessage(data) {
        let message = data;
        let systemMessageForm = `
            <li class="khala-redirection-system">
                <h6>System</h6>
                ${message}
            </li>
        `
        $('.khala-redirection-list').append(systemMessageForm);
        $('.khala-redirection').scrollTop($('.khala-redirection').height());
    }

    var setCookie = function(name, value, day) {
        var date = new Date();
        date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    };
    var getCookie = function(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };
})