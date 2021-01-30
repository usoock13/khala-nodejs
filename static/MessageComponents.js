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
  
export function UserMessage(user, msg) {
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