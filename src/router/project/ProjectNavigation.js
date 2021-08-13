import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addProjectMember,
  addProjectRequestUser,
  createChatroom,
  findUserWithEmail,
} from 'components/fComponents';

const ProjectNavigation = ({
  userObj,
  setUserObj,
  projectObj,
  projectPath,
  setChatroomPath,
  setEditProjectInfo,
}) => {
  const [isAddmembers, setIsAddmembers] = useState(false);
  const [isAddChannels, setIsAddChannels] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newChannelName, setNewChannelName] = useState('');

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
  const onClick = (e) => {
    const {
      target: { id },
    } = e;
    if (id === 'chatList__title-members-add') {
      setIsAddmembers((prev) => !prev);
    } else if (id === 'chatList__title-channels-add') {
      setIsAddChannels((prev) => !prev);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      target: { name },
    } = e;
    if (name === 'add-members') {
      const user = await findUserWithEmail(newMemberName);
      if (user) {
        await addProjectRequestUser(projectObj.projectInfo.projectId, {
          userId: user.userId,
          userName: user.name,
          photoURL: user.profileImg,
          email: user.email,
        });
        alert('접수되었습니다\n리더의 승인 후 유저가 추가됩니다');
      } else {
        alert('존재하지 않는 유저입니다');
      }
      setIsAddmembers(false);
    } else if (name === 'add-channels') {
      const error = defineLenght(newChannelName, 18);
      if (error) {
        if (error === 'notPermitInput') {
          alert('숫자, 영어, 한글을 제외한 특수문자, 공백은 허용되지 않습니다');
        } else if (error === 'overLimit') {
          alert('한글은 9글자, 영어와 숫자는 18글자만 가능합니다');
        }
      } else {
        const chatroomId = await createChatroom({
          userObj,
          path: {
            projectPath,
            chatroomPath: { id: undefined, name: newChannelName },
          },
        });
        const chatroomObj = { id: chatroomId, name: newChannelName };
        let lastEditedProjectList = userObj.lastEditedProjectList;
        for (let i = 0; i < lastEditedProjectList.length; i++) {
          if (lastEditedProjectList[i].projectPath.name === projectPath.name) {
            lastEditedProjectList[i].chatroomPath = chatroomObj;
            setUserObj({
              ...userObj,
              lastEditedProjectList,
            });
          }
        }
        setIsAddChannels(false);
        setChatroomPath(chatroomObj);
        setNewChannelName('');
      }
    }
  };
  const onChange = (e) => {
    const { id, value } = e.target;
    if (id === 'chatList__add-members') {
      setNewMemberName(value);
    } else if (id === 'chatList__add-channels') {
      setNewChannelName(value);
    }
  };
  const changeEditPage = () => {
    setEditProjectInfo((prev) => !prev);
  };
  return (
    <div className="chatList-wrapper">
      <div className="chatList-userInfo">
        <div className="chatList-userInfo__img-wrapper">
          <img className="profile_img lg2" src={userObj.photoURL} alt="img" />
        </div>
        <div className="chatList-userInfo__info">
          <div className="chatList-userInfo__info-name">{userObj.userName}</div>
          <div className="chatList-userInfo__info-email">{userObj.email}</div>
        </div>
      </div>
      {projectObj.leaderId === userObj.userId && (
        <div
          className="chatList-components change-project__wrapper"
          onClick={changeEditPage}
        >
          <i className="bx bxs-crown"></i>
          <div className="change-project__title">Edit Project</div>
        </div>
      )}
      <div className="chatList-components chatList-members">
        <div className="chatList__title">
          <i className="bx bxs-down-arrow"></i>
          <div className="chatList__title-title">Members</div>
          {isAddmembers ? (
            <i
              id="chatList__title-members-add"
              onClick={onClick}
              className="bx bx-arrow-back"
            ></i>
          ) : (
            <i
              id="chatList__title-members-add"
              onClick={onClick}
              className="bx bxs-user-plus"
            ></i>
          )}
        </div>
        {isAddmembers ? (
          <form
            onSubmit={onSubmit}
            name="add-members"
            className="chatList__add"
          >
            <span>Enter member's email</span>
            <input
              type="email"
              placeholder="Enter member's email"
              id="chatList__add-members"
              onChange={onChange}
              value={newMemberName}
            />
            <input type="submit" value="Add member" />
          </form>
        ) : (
          <ul className=" chatList__list-wrapper">
            {projectObj.userObjList.map((member) => (
              <li key={member.userId} className="chatList__list">
                <img src={member.profileImg} alt="img" />
                <span className="chatList__list-title">{member.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="chatList-components chatList-channels">
        <div className="chatList__title">
          <i className="bx bxs-down-arrow"></i>
          <div className=" chatList__title-title">Channels</div>
          {isAddChannels ? (
            <i
              id="chatList__title-channels-add"
              onClick={onClick}
              className="bx bx-arrow-back"
            ></i>
          ) : (
            <i
              id="chatList__title-channels-add"
              onClick={onClick}
              className="bx bxs-plus-square"
            ></i>
          )}
        </div>
        {isAddChannels ? (
          <form
            onSubmit={onSubmit}
            name="add-channels"
            className="chatList__add"
          >
            <span>Create New channel</span>
            <input
              type="text"
              placeholder="Enter channel name"
              id="chatList__add-channels"
              onChange={onChange}
              value={newChannelName}
            />
            <input type="submit" value="create channel" />
          </form>
        ) : (
          <ul className="chatList__list-wrapper">
            {projectObj.chatList.map((chatroom) => (
              <li key={chatroom.id} className="chatList__list">
                <Link
                  className="chatList__list-link"
                  name={chatroom.name}
                  key={chatroom.id}
                  to={{
                    pathname: `/project/${projectObj.projectInfo.projectId}`,
                    hash: `#${chatroom.id}==${chatroom.name}`,
                    state: { fromDashboard: true },
                  }}
                >
                  <span className="chatList__list-hash">#</span>
                  <span className="chatList__list-title">{chatroom.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectNavigation;
