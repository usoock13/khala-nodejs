import React from 'react';

export function SystemMessage({ user, msg }) {
    return (
      <li className="khala-redirection-system">
        <h6>System</h6>
        <div>
          <p>{msg}{user.nickname}</p>
        </div>
      </li>
    )
  }
  
export function UserMessage({user, msg, isMe}) {
    function ChatItemAvatar() {
      const image = `/image/avatar/avatar0${user.avatar}.jpg`;
      return (
        <span className="item-avatar">
          <img src={image} />
        </span>
      )
    }
  
    if (isMe) {
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
    } else {
      return (
        <li class="khala-redirection-item">
          <span class="item-avatar">
            <img src="/image/avatar/avatar04.jpg" />
          </span>
          <h6 class="item-username">{user.nickname}</h6>
          <div class="item-contents">
            <div class="item-frame">
              <p class="item-text active">{msg}</p>
              <p class="item-text origin">Temporary.</p>
            </div>
            <div class="item-switch-wrap">
              <div class="item-switch-origin">
                <i class="fas fa-sync-alt"></i> 
              </div>
            </div>
          </div>
        </li>
      )
    }
  }