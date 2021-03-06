import {
  deleteProjectChannel,
  updateProjectChatList,
} from 'components/fComponents';
import React, { useState } from 'react';

const EditChannelCard = ({ projectObj }) => {
  const [chatList, setChatList] = useState({
    list: Array.from(projectObj.chatList),
  });
  const [deleteList, setDeleteList] = useState([]);
  const [isDeleteDone, setIsDeleteDone] = useState(true);
  const defineLenght = (testString, limitScore) => {
    const limit = Number(limitScore) + 1;
    var check_num = /[0-9]/; // 숫자
    var check_eng = /[a-zA-Z]/; // 문자
    // var check_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    var check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
    let i = 0;
    let total = 0;
    let notPermit = false;
    for (i = 0; i < String(testString).length; i++) {
      if (check_eng.test(testString[i])) {
        total += 1;
      } else if (check_kor.test(testString[i])) {
        total += 2;
      } else if (check_num.test(testString[i])) {
        total += 1;
      } else {
        notPermit = true;
        break;
      }
    }
    if (notPermit) {
      return 'notPermitInput';
    } else {
      if (total >= limit) {
        return 'overLimit';
      } else {
        return null;
      }
    }
  };
  const toggleCSS = (toggleTarget, currentIconClass, input, btn) => {
    if (currentIconClass === 'bx bxs-edit') {
      //start editing
      toggleTarget.classList.value = 'bx bxs-left-arrow-square';
      input.style.pointerEvents = 'all';
      input.style.borderBottom = '1px solid rgba(0,0,0,1)';
      input.style.opacity = 1;
      btn.style.opacity = 1;
      btn.style.pointerEvents = 'all';
    } else {
      //done editing
      toggleTarget.classList.value = 'bx bxs-edit';
      input.style.opacity = 0;
      input.style.pointerEvents = 'none';
      btn.style.opacity = 0;
      btn.style.pointerEvents = 'none';
    }
  };
  const toggleEdit = (e) => {
    const currentIconClass = e.target.classList.value;
    const {
      target: {
        parentNode: { parentNode },
      },
    } = e;
    const input = parentNode.childNodes[1].childNodes[1];
    const btn = parentNode.childNodes[1].childNodes[2];
    toggleCSS(e.target, currentIconClass, input, btn);
  };
  const getMatchIndex = (oldName) => {
    const chanList = Array.from(chatList.list);
    for (let i = 0; i < chanList.length; i++) {
      if (chanList[i].name === oldName) {
        return i;
      }
    }
    return -1;
  };
  const setNewChanName = async (oldName, newName) => {
    const index = getMatchIndex(oldName);
    if (index + 1) {
      let newChatList = chatList.list;
      newChatList[index].name = newName;
      setChatList({ list: newChatList });
      await updateProjectChatList(
        projectObj.projectInfo.projectId,
        newChatList
      );
    } else {
      //can't find
      alert('에러: 채널 이름을 변경할 수 없습니다');
    }
  };
  const isOverlapChannelName = (title) => {
    const channelList = Array.from(projectObj.chatList);
    for (let i = 0; i < channelList.length; i++) {
      if (channelList[i].name === title) {
        return true;
      }
    }
    return false;
  };
  const changeTitle = (e) => {
    e.preventDefault();
    const {
      target: { parentNode },
    } = e;
    const channel = String(parentNode.id).slice('channel=='.length);
    const changedTitle = e.target.childNodes[1].value;
    if (isOverlapChannelName(changedTitle)) {
      //channel name has overlap
      alert('중복된 채널명입니다');
    } else {
      const error = defineLenght(changedTitle, 18);
      if (error) {
        if (error === 'notPermitInput') {
          alert('숫자, 영어, 한글을 제외한 특수문자, 공백은 허용되지 않습니다');
        } else if (error === 'overLimit') {
          alert('한글은 9글자, 영어와 숫자는 18글자만 가능합니다');
        }
      } else {
        const toggleTarget = parentNode.childNodes[2].childNodes[0];
        const currentIconClass = toggleTarget.classList.value;
        setNewChanName(channel, changedTitle);
        toggleCSS(toggleTarget, currentIconClass, e.target[0], e.target[1]);
      }
    }
  };
  const checkDelete = (e) => {
    const clickTarget = e.target.htmlFor;
    if (clickTarget) {
      const chan = String(clickTarget).split('==')[1];
      const inDeleteList = deleteList.indexOf(chan);
      if (inDeleteList + 1) {
        let newDeleteList = [];
        for (let i = 0; i < Array.from(deleteList).length; i++) {
          if (deleteList[i] !== chan) {
            newDeleteList = [...newDeleteList, deleteList[i]];
          }
        }
        //already inside : cancel check
        setDeleteList(newDeleteList);
      } else {
        //check for delete
        const newDeleteList = [...Array.from(deleteList), chan];
        setDeleteList(newDeleteList);
      }
    }
  };
  const deleteChannel = async () => {
    if (deleteList.length) {
      let channelString = '';
      for (let i = 0; i < Array.from(deleteList).length; i++) {
        channelString += `${deleteList[i]}, `;
      }
      const isDelete = window.confirm(
        `${channelString} 채널이 삭제됩니다\n정말 삭제하시겠습니까?`
      );
      if (isDelete) {
        setIsDeleteDone(false);
        const newChatList = await deleteProjectChannel(
          projectObj.projectInfo.projectId,
          deleteList,
          setIsDeleteDone
        );
        setChatList(newChatList);
      }
    } else {
      alert('삭제할 채널을 선택해 주세요.');
    }
  };
  return (
    <div className="editChannelCard-wrapper">
      <div className="editChannelCard__title-wrapper">
        <div className="editChannelCard__title-icon-wrapper">
          <i className="bx bx-chat"></i>
        </div>
        <span>Channel List</span>
        <i className="bx bx-trash" onClick={deleteChannel}></i>
      </div>
      {chatList.list.length ? (
        <ul className="editChannelCard__editChannelList-wrapper">
          {chatList.list.map((channel) => {
            return (
              <li
                key={channel.id}
                id={'channel==' + channel.name}
                className="editChannel-wrapper"
              >
                <div className="editChannel__checkbox-wrapper">
                  <div className="checkBox" onClick={checkDelete}>
                    <input
                      type="checkbox"
                      className="checkBox-input"
                      id={'checkBox==' + channel.name}
                    />
                    <label htmlFor={'checkBox==' + channel.name}></label>
                  </div>
                </div>
                <form
                  onSubmit={changeTitle}
                  className="editChannel__info-wrapper"
                >
                  <span id={'chanTitle'}>{channel.name}</span>
                  <input type="text" placeholder={channel.name} />
                  <button>Change</button>
                </form>
                <div className="editChannel__changeIcon-wrapper">
                  <i onClick={toggleEdit} className="bx bxs-edit"></i>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="editChannelCard__noChannel-wrapper">No Channel</div>
      )}
      {!isDeleteDone && (
        <div className="editChannelCard__deleting">
          <div className="editChannelCard__noChannel-wrapper">Deleting...</div>
        </div>
      )}
    </div>
  );
};

export default EditChannelCard;
