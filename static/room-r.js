'use strict';

import React, { useReducer, useContext, useState } from 'react';
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
  switch(action.type){
    case 'load':
      return {
        ...state,
        isLoading: true
      }
    case 'system-message':
      const newSystemMessage = <SystemMessage user={action.payload.user} key={state.messages.length} />;
      return {
        ...state,
        messages: [
          ...state.messages,
          newSystemMessage
        ]
      };
    case 'user-message':
      const newUserMessage = <UserMessage user={action.payload.user} msg={action.payload.msg} key={user.session} />
      return {
        ...state,
        messages: [
          ...state.messages,
          newUserMessage
        ]
      };
    case 'user-enter':
      const newUser = <UserItem user={action.payload} key={action.payload.session} />
      return {
        ...state,
        users: [
          ...state.users,
          newUser
        ]
      }
  }
}

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
  socket.on('user:enter', (user) => {
    dispatch({
      type: 'system-message',
      payload: { user: user }
    });
    dispatch({ type: 'load' });
    dispatch({ type: 'user-enter', payload: user });
  })

  const [roomState, dispatch] = useReducer(roomReducer, {
    isLoading : false,
    messages: [],
    users: [],
  })

  return (
      <div className="khala-room-wrap">
      <LoadingIcon isLoading={roomState.isLoading} />
        <RoomContext.Provider value={{ roomState, dispatch }}>
          <UserArea />
          <ChatArea />
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

ReactDOM.render(
    <KhalaChatRoom />,
    document.getElementById('khala-room-container')
);