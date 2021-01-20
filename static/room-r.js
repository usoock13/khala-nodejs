'use strict';

import React from 'react';
import './room.css';

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

function ChatArea() {
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

function KhalaChatRoom() {
  return (
      <div className="khala-room-wrap">
        <UserArea />
        <ChatArea />
      </div>
    );
}

ReactDOM.render(
    <KhalaChatRoom />,
    document.getElementById('khala-room-container')
);