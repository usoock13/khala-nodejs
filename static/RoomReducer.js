import React from 'react';
import { SystemMessage, UserMessage } from './MessageComponents';

export const roomReducer = (state, action) => {
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
        const newUserMessage = <UserMessage 
                                  orgUser={payload.orgUser}
                                  msg={payload.orgMsg}
                                  targetLanguages={payload.targetLanguages}
                                  translatedMessages={payload.translatedMessages}
                                  userConfig={payload.userConfig}
                                  isSuccessive={payload.isSuccessive}
                                  key={state.messages.length}
                                  isMe={payload.isMe} 
                                />
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