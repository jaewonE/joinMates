import {
  addProjectRequestUser,
  findProjectWithName,
} from 'components/fComponents';
import React, { useState } from 'react';

const ProfileJoinProjectCard = ({ userObj, setUserObj }) => {
  const [isEnterProject, setIsEnterProject] = useState(true);
  const [isSearching, setIsSearching] = useState(true);
  const [projectList, setProjectList] = useState(null);
  const [title, setTitle] = useState('');
  const [titleWarn, setTitleWarn] = useState('');
  const [count, setCount] = useState(0);

  const goBack = () => {
    setProjectList(null);
    setTitle('');
    setTitleWarn('');
    setCount(0);
    setIsEnterProject(true);
    setIsSearching(true);
  };
  const onChangeTitle = (e) => {
    const {
      target: { value },
    } = e;
    const title = String(value);
    if (title.indexOf(' ') + 1) {
      setTitleWarn('띄워쓰기 없이 입력해주십시오');
    } else {
      setTitleWarn('');
    }
    setTitle(value);
  };
  const submitTitle = async (e) => {
    e.preventDefault();
    if (!titleWarn) {
      const wrapper = document.querySelector('.enterJoinProject-wrapper');
      wrapper.classList.add('joinProject__fade-out');
      setTimeout(() => {
        setIsEnterProject(false);
      }, 350);
      const projectListRef = await findProjectWithName(title);
      if (projectListRef) {
        setProjectList(projectListRef);
      }
      setIsSearching(false);
    }
  };
  const defineNotUserProject = () => {
    const userProjectList = Array.from(userObj.projectList);
    for (let i = 0; i < userProjectList.length; i++) {
      if (projectList[count].id === userProjectList[i].projectId) {
        return false;
      }
    }
    return true;
  };
  const joinProject = async () => {
    const projectId = projectList[count].id;
    if (defineNotUserProject()) {
      const oldRequestMessages = Array.from(userObj.requestMessages);
      let moveOn = true;
      let newRequestMessages = [];
      for (let i = 0; i < oldRequestMessages.length; i++) {
        if (projectId === oldRequestMessages[i].projectId) {
          if (oldRequestMessages[i].state === 'reject') {
            const confirm = window.confirm(
              '거절된 프로젝트입니다\n재신청 하시겠습니까?'
            );
            if (confirm) {
              moveOn = true;
            } else {
              moveOn = false;
            }
          } else {
            moveOn = false;
          }
        } else {
          newRequestMessages.push(oldRequestMessages[i]);
        }
      }
      if (moveOn) {
        await addProjectRequestUser(projectId, userObj);
        newRequestMessages.push({
          projectName: projectList[count].name,
          projectId: projectList[count].id,
          projectImg: projectList[count].projectImg,
          leader: projectList[count].leader,
          requestDate: Date.now(),
          state: 'pending',
        });
        setUserObj({
          ...userObj,
          requestMessages: newRequestMessages,
        });
        alert('성공적으로 요청 메세지를 전송하였습니다');
      } else {
        alert('이미 요청된 프로젝트입니다');
      }
    } else {
      alert('이미 존재하는 프로젝트이거나 요청된 프로젝트입니다');
    }
  };
  const changeProjectListPage = (e) => {
    const {
      target: { classList },
    } = e;
    if (classList.value === 'joinProject__swift-right') {
      setCount((prev) => prev + 1);
    } else if (classList.value === 'joinProject__swift-left') {
      setCount((prev) => prev - 1);
    }
  };
  return (
    <div className="joinProject-wrapper">
      {isEnterProject ? (
        <form onSubmit={submitTitle} className="enterJoinProject-wrapper">
          <input
            type="text"
            className="enterJoinProject__input"
            placeholder="Enter Project Name"
            onChange={onChangeTitle}
            value={title}
          />
          {titleWarn ? (
            <span className="enterJoinProject__title-warn">{titleWarn}</span>
          ) : (
            <React.Fragment>
              <label
                className="enterJoinProject__label"
                htmlFor="enterJoinProject__submit-btn"
              >
                <i className="bx bx-right-arrow-circle bx-flip-vertical"></i>
              </label>
              <input
                className="enterJoinProject__submit"
                id="enterJoinProject__submit-btn"
                type="submit"
                value=""
              />
            </React.Fragment>
          )}
        </form>
      ) : (
        <React.Fragment>
          {isSearching ? (
            <div className="loading-container">
              <div className="loading"></div>
              <div id="loading-text">Searching</div>
            </div>
          ) : (
            <React.Fragment>
              {projectList ? (
                <div className="joinProject-project-wrapper">
                  <div className="joinProject-project__img-wrapper">
                    <img
                      src={projectList[count].projectImg}
                      alt="project_img"
                    />
                    <div>{projectList[count].name}</div>
                  </div>
                  <div className="joinProject-project__info-wrapper">
                    <div className="info-leader-wrapper">
                      <div className="info-leader__img-wrapper">
                        <img
                          src={projectList[count].leader.profileImg}
                          alt="img"
                        />
                      </div>
                      <div className="info-leader__info">
                        <span className="info-leader__info-name">
                          {projectList[count].leader.name}
                        </span>
                        <span className="info-leader__info-email">
                          {projectList[count].leader.email}
                        </span>
                      </div>
                    </div>
                    <div className="info-description">
                      <span>Project Description</span>
                      <div>{projectList[count].description}</div>
                    </div>
                    <input
                      id="joinProject-btn"
                      type="button"
                      value="Join Project"
                      onClick={joinProject}
                    />
                  </div>
                  {Boolean(projectList[count + 1]) && (
                    <div
                      onClick={changeProjectListPage}
                      className="joinProject__swift-right"
                    >
                      <div className="joinProject__swift-description-right">
                        Next
                      </div>
                      <div className="swift-arrow swift-right"></div>
                    </div>
                  )}
                  {count > 0 && Boolean(projectList[count - 1]) && (
                    <div
                      onClick={changeProjectListPage}
                      className="joinProject__swift-left"
                    >
                      <div className="swift-arrow swift-left"></div>
                      <div className="joinProject__swift-description-left">
                        Previous
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="joinProject-noProject-wrapper">
                  <span>No Project Found</span>
                  <input type="button" value="Go Back" onClick={goBack} />
                </div>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default ProfileJoinProjectCard;
