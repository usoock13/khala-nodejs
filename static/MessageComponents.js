import React, { useRef } from 'react';

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

export function UserMessage({ orgUser, orgMsg, targetLanguages, translatedMessages, userConfig, isMe, isSuccessive }) {
    const SUCCESSIVE_CLASS = "successive";
    const textItemsRef = useRef();

    function ChatItemAvatar() {
      const image = `/image/avatar/avatar0${orgUser.avatar}.jpg`;
      return (
        <span className="item-avatar">
          <img src={image} />
        </span>
      )
    }
  
    function ChangeButton({ type, HandleClick }) {
      return <li className="item-switch-translation-button" onClick={HandleClick}>{type}</li>
    }

    function HandleChangeButton(e) {
      // 기존 활성화 언어
      let prevLang;
      textItemsRef.current.childNodes.forEach(item => {
        if(item.classList.contains('active')) prevLang = item.dataset.lang.toUpperCase();
      })
      // 클릭 후 활성화 언어
      let targetLang = e.target.innerText;
      textItemsRef.current.childNodes.forEach(item => {
        item.classList.remove('active');
        if(item.dataset.lang.toLowerCase() === targetLang.toLowerCase()) {
          item.classList.add('active');
        }
      })
      e.target.innerText = prevLang;
    }
    
    if (isMe) {
      let changeBtns = [];
      let textItems = [];
      translatedMessages.forEach((item, index) => {
        changeBtns.push(<ChangeButton type={item.type} HandleClick={HandleChangeButton} key={index} />);
        textItems.push(<p className="item-text" data-lang={item.type} key={index}>{item.msg}</p>)
      })
      return (
        <li className={`khala-redirection-item isMe${isSuccessive ? " "+SUCCESSIVE_CLASS : ""}`}>
          <ChatItemAvatar />
          <h6 className="item-username">{orgUser.nickname}</h6>
          <div className="item-contents">
            <div className="item-frame" ref={textItemsRef}>
              <p className="item-text active" data-lang={orgUser.language}>{orgMsg}</p>
              {textItems}
            </div>
            <div className="item-switch-wrap">
              <ul className="item-switch-translation">
                {changeBtns}
              </ul>
            </div>
          </div>
        </li>
      )
    } else {
      const translatedMsg = translatedMessages.filter(item => item.type === userConfig.language)[0].msg;
      return (
        <li className={`khala-redirection-item${isSuccessive ? " "+SUCCESSIVE_CLASS : ""}`}>
          <span className="item-avatar">
            <ChatItemAvatar />
          </span>
          <h6 className="item-username">{orgUser.nickname}</h6>
          <div className="item-contents">
            <div className="item-frame">
              <p className="item-text active">{translatedMsg}</p>
              <p className="item-text origin">{orgMsg}</p>
            </div>
            <div className="item-switch-wrap">
              <div className="item-switch-origin">
                <i className="fas fa-sync-alt"></i> 
              </div>
            </div>
          </div>
        </li>
      )
    }
  }