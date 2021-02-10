'use strict';

import React, { useReducer, useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './room.css';
import { io } from 'socket.io-client';
import SERVER_CONFIG from '../server-config.json';

import { getCookie, getParam } from './GetParams';
import LoadingIcon from './LoadingIcon';
import { SystemMessage, UserMessage } from './MessageComponents';
import { UserItem } from './UserComponent'
const socket = io(`ws://${SERVER_CONFIG.url}/room`);

const RoomContext = React.createContext();

const roomReducer = (state, action) => {
  const payload = action.payload;
  switch(action.type){
    case 'load':
      return {
        ...state,
        isLoading: true
      }
    case 'system-message':
      const newSystemMessage = <SystemMessage user={payload.user} msg={payload.msg} key={state.messages.length} />;
      return {
        ...state,
        messages: [
          ...state.messages,
          newSystemMessage
        ]
      };
    case 'user-message':
      const newUserMessage = <UserMessage user={payload.user} msg={payload.msg} key={state.messages.length} isMe={payload.isMe} />
      return {
        ...state,
        messages: [
          ...state.messages,
          newUserMessage
        ]
      };
    case 'user-enter':
      let nextUserComponents = payload;
      return {
        ...state,
        users: [
          nextUserComponents
        ]
      }
  }
}

function KhalaChatRoom() {
  const [roomState, dispatch] = useReducer(roomReducer, {
    isLoading : false,
    messages: [],
    users: [],
  })
  // 서버측 User정보 요청 이벤트
  useEffect(() => {
    // 서버의 User Info (khala-config) 요청에 응답
    socket.on('require:userinfo', data => {
      // 요청 응답. User정보(me)를 서버에서 받으면 해당 User를 입장시킨 후 emit.('user:enter')처리
      socket.emit('send:userinfo', JSON.stringify({
        userConfig: getCookie('khala-config'),
        roomNumber: getParam('room-no')
      }));
    });
    // 사용자 입장 이벤트 (socket.io). User정보를 받은 서버로부터 전달받는 event-user:enter에 대한 처리
    socket.on('user:enter', (users, enterUser) => {
      if(!enterUser) return;
      if(!roomState.isLoading) dispatch({ type: 'load' });

      // jsx형식으로 UserItem을 담을 배열 선언
      let nextUserComponents = new Array();
      users.forEach(user => {
        nextUserComponents.push(<UserItem user={user} key={user.session} />)
      });
      dispatch({ type: 'system-message', payload: { user: enterUser, msg: "Welcom, " } });
      dispatch({ type: 'user-enter', payload: nextUserComponents });
    });
    // 방 번호 조회 결과, 방이 존재하지 않을 경우의 핸들러
    socket.on('not-exist-room', () =>  {
      alert('The room does not exist... Looks like you need a new room!');
      location.href = '/create-room';
    })
    // 사용자 퇴장 이벤트 핸들러 >>
    socket.on('response:user-leave', (users, exitUser) => {
      let nextUserComponents = new Array();
      users.forEach(user => {
        nextUserComponents.push(<UserItem user={user} key={user.session} />)
      });
      dispatch({ type: 'system-message', payload: { user: exitUser, msg: "Goodbye, " } });
      dispatch({ type: 'user-enter', payload: nextUserComponents });
    })
  }, []);
  useEffect(() => {
    let messageContainer = document.querySelector('.khala-chat-redirection')
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [roomState.messages])

  return (
      <div className="khala-room-wrap">
      <LoadingIcon isLoading={roomState.isLoading} />
        <RoomContext.Provider value={{ roomState, dispatch }}>
          <UserArea io={io} />
          <ChatArea io={io} />
        </RoomContext.Provider>
      </div>
    );
}

function UserArea() {
  let users = useContext(RoomContext).roomState.users;
  return (
    <section className="khala-userarea">
      <div className="khala-userarea-header">
        <span className="khala-user-number"></span>
      </div>
      <div className="khala-userarea-body">
        <ul className="khala-userlist">
          {users}
        </ul>
      </div>
    </section>
  );
}

function ChatArea() {
  let dispatch = useContext(RoomContext).dispatch;
  let formRef = useRef();

  const HandleSubmit = (e) => {
    e.preventDefault();
    const msg = formRef.current.text.value;
    if(msg.trim().length <= 0) return;
    SendUserMessage(msg)
  }

  // 서버쪽으로 메세지 보내기
  const SendUserMessage = (msg) => {
    socket.emit('send:user-message', msg);
    formRef.current.reset();
  }
  useEffect(() => {
    formRef.current.text.focus();
    // 서버측에서 오는 메세지 핸들러
    socket.on('response:user-message', (user, msg) => {
      const isMe = user.session === socket.id;
      dispatch({ type: 'user-message', payload: {user, msg, isMe} })
    })
  }, [])
  const HandleKeyDown = (e) => {
    // Enter 입력
    if(e.keyCode === 13) {
      e.preventDefault();
      const msg = formRef.current.text.value;
      SendUserMessage(msg);
    }
  }

  let messages = useContext(RoomContext).roomState.messages;
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
          {messages}
        </ul>
      </div>
      <div className="khala-chat-input">
        <form className="khala-input-form" ref={formRef} onKeyDown={HandleKeyDown} onSubmit={HandleSubmit}>
          <textarea className="khala-input-text" name="text"></textarea>
          <div className="khala-input-buttonWrap">
            <input id="khala-text-submit" type="submit" value="send" />
          </div>
        </form>
      </div>
    </section>
  );
}

ReactDOM.render(
    <KhalaChatRoom />,
    document.getElementById('khala-room-container')
);