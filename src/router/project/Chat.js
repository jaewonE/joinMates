import { createChat, getChatList } from 'components/fComponents';
import React, { useEffect, useRef, useState } from 'react';

const getChatTime = (num) => {
  const t = new Date(Number(num));
  const hour = t.getHours();
  let min = t.getMinutes();
  if (min < 10) {
    min = `0${min}`;
  }
  const setAmPm = hour < 12;
  const timeString = `${setAmPm ? hour : hour - 12}:${min}${
    setAmPm ? 'am' : 'pm'
  }`;
  return timeString;
};

/*
1. if top에 도달: scrollTop === 0이면 bringChatList 실행
2. else if 가장 아래에 있는 경우(아무것도 건들지 않은 경우) 가장 아래로
3. else 새로 나온 chat에 대한 알림.
*/

const Chat = ({ userObj, projectObj, projectPath, chatroomPath }) => {
  const [userInput, setUserInput] = useState('');
  // const [chatPath, setChatPath] = useState('');
  const [chatList, setChatList] = useState([]);
  const onMount = useRef(false);
  const scrollDown = useRef(true);
  const resetChatList = useRef(null);
  const chatSettingObj = useRef({
    isUpdateChatList: true,
    limit: 10,
    times: 1,
  });

  useEffect(() => {
    const setScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      if (scrollTop === 0) {
        console.count('at the top');
        chatSettingObj.current = {
          ...chatSettingObj.current,
          times: chatSettingObj.current.times + 1,
          isUpdateChatList: true,
        };
        scrollDown.current = false;
        bringChatList();
      } else {
        const offsetHeight = e.target.offsetHeight;
        const scrollHeight = e.target.scrollHeight;
        if (scrollTop < scrollHeight - 1.5 * offsetHeight) {
          scrollDown.current = false;
          console.log('create chat bottom');
        } else {
          scrollDown.current = true;
        }
      }
    };
    const bringChatList = () => {
      if (chatSettingObj.current.isUpdateChatList) {
        console.log('getChatList');
        if (resetChatList.current) {
          resetChatList.current();
        }
        let times;
        times = chatSettingObj.current.times;
        resetChatList.current = getChatList({
          path: {
            projectPath,
            chatroomPath,
          },
          setFunc: setChatList,
          limit: 10 * times,
        });
        chatSettingObj.current.isUpdateChatList = false;
      }
    };
    if (!onMount.current) {
      chatSettingObj.current = {
        isUpdateChatList: true,
        limit: 10,
        times: 1,
      };
      setUserInput('');
      if (resetChatList.current) {
        resetChatList.current();
      }
      scrollDown.current = true;
      bringChatList();
    }
    const chat__body = document.querySelector('.chat__body');
    chat__body.addEventListener('scroll', setScroll);
    return () => chat__body.removeEventListener('scroll', setScroll);
  }, [projectPath, chatroomPath]);

  useEffect(() => {
    const chat__body = document.querySelector('.chat__body');
    if (scrollDown.current) {
      chat__body.scrollTop = chat__body.scrollHeight;
    }
  }, [chatList]);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setUserInput(value);
  };
  const submitMessage = (e) => {
    e.preventDefault();
    createChat({
      path: {
        projectPath,
        chatroomPath,
      },
      userObj,
      chat: userInput,
    });
    setUserInput('');
  };
  return (
    <div className="chat-wrapper">
      <div className="chat__header">
        <div className="chat__header-title">
          <span>#{chatroomPath.name}</span>
        </div>
        <div className="chat__header-additional">
          <div className="chat__header-search">
            <i className="bx bx-search"></i>
            <input type="text" placeholder="Search" />
          </div>
          <div className="chat__header-more">
            <i className="bx bx-dots-vertical-rounded"></i>
          </div>
        </div>
      </div>
      <ul className="chat__body">
        {chatList.map((chat) => {
          return (
            <li
              key={chat.createTime}
              className={
                userObj.userId === chat.createrObj.createrId
                  ? 'owner chat-msg'
                  : 'chat-msg'
              }
            >
              <div className="chat-msg-profile">
                <img
                  className="chat-msg-img"
                  src={chat.createrObj.createrProfileImg}
                  alt="profile_img"
                />
                <div className="chat-msg-date">
                  {getChatTime(chat.createTime)}
                </div>
              </div>
              <div className="chat-msg-content">
                <div className="chat-msg-text">{chat.doc}</div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="chat__enter">
        <div className="chat__enter-option main-option chat__enter-addFile">
          <i className="bx bxs-image-add"></i>
        </div>
        <form onSubmit={submitMessage} className="chat__enter-input">
          <input
            placeholder="Type a message..."
            value={userInput}
            onChange={onChange}
            type="text"
          />
        </form>
        <div
          onClick={submitMessage}
          className="chat__enter-option sub-option chat__enter-submit"
        >
          <i className="bx bxs-message-alt-add"></i>
        </div>
      </div>
    </div>
  );
};

export default Chat;
