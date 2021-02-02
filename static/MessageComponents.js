import React from 'react';

export function SystemMessage({ user }) {
    return (
      <li className="khala-redirection-system">
        <h6>System</h6>
        <div>
          <p>Welcome, {user.nickname}</p>
        </div>
      </li>
    )
  }
  
export function UserMessage({user, msg}) {
    function ChatItemAvatar() {
      const image = `/image/avatar/avatar0${user.avatar}.jpg`;
      return (
        <span className="item-avatar">
          <img src={image} />
        </span>
      )
    }
  
    return (
      <li className="khala-redirection-item isMe">
        <ChatItemAvatar />
        <h6 className="item-username">{user.nickname}</h6>
        <div className="item-contents">
          <div className="item-frame">
            <p className="item-text active" data-lang="ko">{msg}</p>
          </div>
          <div className="item-switch-wrap">
            <ul className="item-switch-translation">
              <li className="item-switch-translation-button">KO</li>
            </ul>
          </div>
        </div>
      </li>
    )
  }