'use strict';

import React, { useReducer, useContext } from 'react';
import ReactDOM from 'react-dom';
import './room.css';
import { io } from 'socket.io-client';
import SERVER_CONFIG from '../server-config.json';
const socket = io(`ws://${SERVER_CONFIG.url}/room`);

const MessageContext = React.createContext();

function KhalaChatRoom() {
  // 서버측 User정보 요청 이벤트
  socket.on('require:userinfo', data => {
    // 요청 응답. User정보(me)를 서버에서 받으면 해당 User를 입장시킨 후 emit.('user:enter')처리
    socket.emit('send:userinfo', JSON.stringify({
      userConfig: getCookie('khala-config'),
      roomNumber: getParam('room-no')
    }));
  })

  // User 입장 이벤트 (socket.io). User정보를 받은 서버로부터 전달받는 event-user:enter에 대한 처리
  const OnUserEnter = () => {
    socket.on('user:enter', (userName) => {
      dispatch({ type: 'system', payload: userName });
    })
  }

  const [message, dispatch] = useReducer(messageReducer, []);
  
  return (
      <div className="khala-room-wrap">
        <MessageContext.Provider value={{ message, dispatch, OnUserEnter }}>
          <ChatArea />
          <UserArea />
        </MessageContext.Provider>
      </div>
    );
}

function SystemMessage({ userName }) {
  return (
    <li class="khala-redirection-system">
      <h6>System</h6>
      <div>
        <p>Welcome, {userName}</p>
      </div>
    </li>
  )
}

function ChatItem(user, msg) {
  function ChatItemAvatar() {
    image = `/image/avatar/avatar0${user.avatar}.jpg`;
    return (
      <span class="item-avatar">
        <img src={image} />
      </span>
    )
  }

  return (
    <li class="khala-redirection-item isMe">
      <ChatItemAvatar />
      <h6 class="item-username">usw</h6>
      <div class="item-contents">
        <div class="item-frame">
          <p class="item-text active" data-lang="ko">나는 유숙이다</p>
        </div>
        <div class="item-switch-wrap">
          <ul class="item-switch-translation">
          </ul>
        </div>
      </div>
    </li>
  )
}

function UserArea() {
  return (
    <section className="khala-userarea">
      <div className="khala-userarea-header">
        <span className="khala-user-number"></span>
      </div>
      <div className="khala-userarea-body">
        <ul className="khala-userlist">
          
        </ul>
      </div>
    </section>
  );
}

function ChatArea(props) {
  let message = useContext(MessageContext).message;
  return (
    <section className="khala-chat">
      <div className="khala-chat-header">
        <p className="khala-chat-url">
          <span>-</span>
          <button className="khala-urlcopy">copy</button>
        </p>
      </div>
      <div className="khala-chat-redirection">
        <ul className="khala-redirection-list">
          {message}
        </ul>
      </div>
      <div className="khala-chat-input">
        <form className="khala-input-form">
          <textarea className="khala-input-text" name="text"></textarea>
          <div className="khala-input-buttonWrap">
            <input id="khala-text-submit" type="submit" value="send" />
          </div>
        </form>
      </div>
    </section>
  );
}

const messageReducer = (state, action) => {
  switch(action){
    case 'system':
      const newItem = <SystemMessage userName={action.userName} />;
      return {...state, newItem };
    case 'message':
      return;
  }
}

ReactDOM.render(
    <KhalaChatRoom />,
    document.getElementById('khala-room-container')
);

function getCookie(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
};
function getParam(sname) {
  var params = location.search.substr(location.search.indexOf("?") + 1);
  var sval = "";
  params = params.split("&");
  for (var i = 0; i < params.length; i++) {
    var temp = params[i].split("=");
    if ([temp[0]] == sname) { sval = temp[1]; }
  }
  return sval;
}