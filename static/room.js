let temp = false;
$(function() {
    // WEB Socket >>
    // 「WebSocketEx」는 프로젝트 명
    // 「broadsocket」는 호스트 명
    // WebSocket 오브젝트 생성 (자동으로 접속 시작한다. - onopen 함수 호출)
    var config = getCookie('khala-config');
    console.log(config);
    var webSocket = new WebSocket(
          "wss://khala-world.herokuapp.com/broadsocket/room");
              //"ws://localhost:8080/broadsocket/room");
    // 콘솔 텍스트 에리어 오브젝트
    var messageTextArea = $('.khala-input-text');
    // WebSocket 서버와 접속이 되면 호출되는 함수
    webSocket.onopen = function(message) {
        // 콘솔 텍스트에 메시지를 출력한다.
        let data = JSON.stringify({
            type: 'system',
            userConfig: config,
            msg: `Welcome, ${JSON.parse(config).nickname}!`,
            roomNumber: getParam('room-no')
        })
        webSocket.send(data);
        setInterval(() => {
            webSocket.send(JSON.stringify({
                type: 'pulse',
            }))
        }, 15000);
    };
    // WebSocket 서버와 접속이 끊기면 호출되는 함수
    webSocket.onclose = function(message) {
        // 콘솔 텍스트에 메시지를 출력한다.
        AppendSystemMessage("Server Disconnect...");
    };
    // WebSocket 서버와 통신 중에 에러가 발생하면 요청되는 함수
    webSocket.onerror = function(message) {
        // 콘솔 텍스트에 메시지를 출력한다.
        console.log(message);
        AppendSystemMessage("error...");
    };
    /// WebSocket 서버로 부터 메시지가 오면 호출되는 함수
    webSocket.onmessage = function(message) {
        // 콘솔 텍스트에 메시지를 출력한다.
        switch(JSON.parse(message.data).type){
            case "system":
                SetUser(JSON.parse(message.data))
                break;
            case "message":
                let data = {
                    isMe: JSON.parse(message.data).isMe,
                    message: JSON.parse(message.data).msg,
                    username: JSON.parse(message.data).username,
                    avatar: JSON.parse(message.data).avatar,
                    originalText: JSON.parse(message.data).orginalText,
                    translationText: JSON.parse(message.data).translationText,
                    isSuccessive: JSON.parse(message.data).isSuccessive
                }
                console.log(data);
                AppendChat(data);
                break;
            case "error":
                alert(JSON.parse(message.data).msg);
                document.location.href = "/create-room.jsp";
        }
    };
    // Send 버튼을 누르면 호출되는 함수
    $('.khala-input-form').keydown(function(e) {
        if(e.keyCode===13){
            e.preventDefault();
            $('.khala-input-form').submit();
        }
    })
    $('.khala-input-form').submit(function(e) {
        e.preventDefault();
        // 송신 메시지를 작성하는 텍스트 박스 오브젝트를 취득
        var messageTextArea = $('.khala-input-text').eq(0);
        // 콘솔 텍스트에 메시지를 출력한다.
        if(!messageTextArea.val()) return;
        let data = JSON.stringify({
            type: 'message',
            message: messageTextArea.val()
        })
        // webSocket.send("{{" + user + "}}" + messageTextArea.val());
        webSocket.send(data);
        messageTextArea.val('');
    })
    // webSocket.close();  // WebSocket 접속 해제
    
    function AppendChat({ isMe, message, username, avatar, originalText, translationText, isSuccessive }) {
        let keysOfTranslation = Object.keys(translationText);
        let valuesOfTranslation = Object.values(translationText);
        let SUCCESSIVE_CLASS = ' successive';
        console.log(isSuccessive);
        // 채팅 메세지에 추가할, 번역문 보기 버튼 대입용 변수 초기화
        let itemSwitchWrap = $('<div class="item-switch-wrap"></div>'),
            textFrame = $('<div class="item-frame"></div>');
        switch(isMe){
            case true:
                CreateMyChat();
                break;
            case false:
                CreateOthersChat();
                break;
        }
        function CreateMyChat() {
            // 추가할 번역문 유무와 관계없이 추가되는 redirection된 my Chat-item(message)을 추가
            textFrame.append( $(`<p class="item-text active" data-lang="${JSON.parse(config).language}">${originalText}</p>`) );
            let itemSwitchList = $('<ul class="item-switch-translation"></ul>');
            itemSwitchWrap.append(itemSwitchList);

            if(keysOfTranslation.length){
                // 추가할 번역문이 있을 경우(타언어와 대화 중일 경우) changeTranslationButtonList를 jQuery ul 객체로 선언
                // 번역문 종류만큼 반복
                for(var i=0; i<keysOfTranslation.length; i++){
                    // ul 안에 li로 번역문 아이템 추가
                    itemSwitchList.append($('<li class="item-switch-translation-button">'+keysOfTranslation[i]+'</li>'))
                    textFrame.append($(`<p class="item-text" data-lang="${keysOfTranslation[i]}">` + valuesOfTranslation[i] + '</p>'))
                }
            }
            // 각 jQuery객체를 html tag 형식으로 변환
            itemSwitchWrap = itemSwitchWrap[0].outerHTML;
            textFrame = textFrame[0].outerHTML;
            Append();
        }
        function CreateOthersChat() {
            let itemSwitchList = $('<div class="item-switch-origin"> <i class="fas fa-sync-alt"></i> </div>');
            itemSwitchWrap.append(itemSwitchList);
            textFrame.append($(`<p class="item-text active">${message}</p>`));
            textFrame.append($(`<p class="item-text origin">${originalText}</p>`));
            // 각 jQuery객체를 html tag 형식으로 변환
            itemSwitchWrap = itemSwitchWrap[0].outerHTML;
            textFrame = textFrame[0].outerHTML;
            Append();
        }
        function Append() {
            // 메세지폼에 값을 추가하여 리다이렉션 에리어에 추가
            let messageForm = 
                `<li class="khala-redirection-item${(isMe ? " isMe" : "")}${isSuccessive ? SUCCESSIVE_CLASS : ""}">`
                    + `<span class="item-avatar"><img src="/image/avatar/avatar0${avatar}.jpg" /></span>`
                    + `<h6 class="item-username">${username}</h6>`
                    + `<div class="item-contents">` 
                        + textFrame
                        + itemSwitchWrap
                    + '</div>'
                + '</li>'
            $('.khala-redirection-list').append(messageForm)
            $('.khala-chat-redirection').scrollTop($('.khala-redirection-list').height());
        }
    }
    function AppendSystemMessage(data) {
        let message = data;
        console.log(message);
        let systemMessageForm = 
            '<li class="khala-redirection-system">'
                + '<h6>System</h6>'
                + '<div>' + '<p>' + message + '</p>' + '</div>'
            + '</li>'
        $('.khala-redirection-list').append(systemMessageForm);
        $('.khala-chat-redirection').scrollTop($('.khala-redirection-list').height());
    }
    function SetUser(userinfo){
        let target = $('.khala-userarea-body .khala-userlist');
        console.log(userinfo);
        let userList = JSON.parse(userinfo.userList);
        target.empty();
        for(let i=0; i<Object.keys(userList).length; i++){
            // User List를 받아 프론트단의 User목록을 세팅 >>
            let addForm =
                `<li class="khala-useritem">
                    <span class="khala-useritem-avatar">
                        <img src="/image/avatar/avatar0${Object.values(userList)[i]}.jpg" alt="">
                    </span>
                    <p class="khala-useritem-name">${Object.keys(userList)[i]}</p>
                </li>`;
            target.append(addForm);
            // << User List를 받아 프론트단의 User목록을 세팅

            // 방에 참여중인 User 수를 표시 >>
            $('.khala-userarea-header .khala-user-number').text(`${Object.keys(userList).length} people in room`);
            // << 방에 참여중인 User 수를 표시
        }
        AppendSystemMessage(userinfo.msg);
    }
    function getCookie(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };
    // << WEB Socket

    // URL syncronize >>
    $('.khala-chat-url span').text(document.location.href);
    // << URL syncronize

    // Change Text in Chat Item >>

        // Change to Origin-Text >>
    $(document).on('click', '.khala-redirection-item .item-switch-origin', function(){
        let chatItem = $(this).closest('.khala-redirection-item');
        chatItem.find('.item-frame').css('width', '');
        chatItem.find('.item-text').toggleClass('active');
        chatItem.find('.item-frame').css('width', chatItem.find('.item-text.active').innerWidth());
    })  // << Change to Origin-Text

        // Change to Translation-Text >>
    $(document).on('click', '.khala-redirection-item .item-switch-translation-button', function(){
        let chatItem = $(this).closest('.khala-redirection-item');
        let targetText = $(this).text();
        let targetButton = $(this);
        let originLang = chatItem.find('.item-text.active').attr('data-lang');

        chatItem.find('.item-frame').css('width', '');
        chatItem.find(`.item-text`).removeClass('active');
        chatItem.find(`.item-text[data-lang="${targetText}"]`).addClass('active');
        targetButton.text(originLang);
        chatItem.find('.item-frame').css('width', chatItem.find('.item-text.active').innerWidth());
    })
        // << Change to Translation-Text

    // << Change Text in Chat Item

    // URL copy >>
    $('button.khala-urlcopy').click(function() {
        selectText('.khala-chat-url span');
        document.execCommand("copy");
        alert('URL copied!');
    })
    // << URL copy
})
function selectText(node, callback) {
    node = document.querySelector(node);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

function getParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }
    return sval;
}