import { addUserInProject } from 'components/fComponents';
import React, { useEffect, useState } from 'react';

const ProfileRequestCard = ({ userObj, setUserObj }) => {
  const [requestList, setRequestList] = useState(null);
  useEffect(() => {
    let change = false;
    const oldRequestList = Array.from(userObj.requestMessages);
    let newRequestList = [];
    for (let i = 0; i < oldRequestList.length; i++) {
      if (oldRequestList[i].state === 'reject') {
        const requestTime = oldRequestList[i].requestDate;
        const weekTime = 604800000;
        if (Date.now() - requestTime < weekTime) {
          newRequestList.push(oldRequestList[i]);
        } else {
          change = true;
        }
      } else if (oldRequestList[i].state === 'fulfilled') {
        change = true;
      } else {
        newRequestList.push(oldRequestList[i]);
      }
    }
    if (change) {
      setUserObj({
        ...userObj,
        requestMessages: newRequestList,
      });
    }
    if (newRequestList.length) {
      setRequestList(newRequestList);
    } else {
      setRequestList(null);
    }
  }, [userObj, setUserObj]);
  const getDate = (requestDate) => {
    var d = new Date(Number(requestDate));
    const year = String(d.getFullYear()).slice(2);
    let month = String(d.getMonth() + 1);
    if (month.length === 1) {
      month = `0${month}`;
    }
    let day = String(d.getDate());
    if (day.length === 1) {
      day = `0${day}`;
    }
    return `${year}:${month}:${day}`;
  };
  const joinProject = async (e) => {
    const {
      target: { name },
    } = e;
    const { chatroom, projectInfo } = await addUserInProject(
      name,
      userObj.userId
    );

    let projectList = Array.from(userObj.projectList);
    projectList.push(projectInfo);
    let lastEditedProjectList = Array.from(userObj.lastEditedProjectList);
    lastEditedProjectList.push({
      chatroomPath: chatroom,
      projectPath: {
        id: projectInfo.projectId,
        name: projectInfo.projectName,
      },
    });
    const oldRequestList = Array.from(requestList);
    let requestMessages = [];
    for (let i = 0; i < oldRequestList.length; i++) {
      if (oldRequestList[i].projectId !== name) {
        requestMessages.push(oldRequestList[i]);
      }
    }
    setUserObj({
      ...userObj,
      lastEditedProjectList,
      projectList,
      requestMessages,
    });
    setRequestList(requestMessages);
  };
  const rejectProject = (e) => {
    const {
      target: { name },
    } = e;
    const oldRequestList = Array.from(requestList);
    let requestMessages = [];
    for (let i = 0; i < oldRequestList.length; i++) {
      if (oldRequestList[i].projectId !== name) {
        requestMessages.push(oldRequestList[i]);
      }
    }
    setUserObj({
      ...userObj,
      requestMessages,
    });
    setRequestList(requestMessages);
  };
  return (
    <div className="requestCard-wrapper">
      {requestList ? (
        <ul className="requestCard__list-wrapper">
          <li className="requestCard-warn">
            거부된 메세지는 7일 후에 자동으로 삭제됩니다.
          </li>
          {requestList.map((message) => {
            return (
              <li key={message.projectId} className="request-wrapper">
                <div className="request-wrapper__marked"></div>
                <div className="request-time__wrapper">
                  <span>{getDate(message.requestDate)}</span>
                </div>
                <div className="request-project__wrapper">
                  <div className="request-project__img-wrapper">
                    <img src={message.projectImg} alt="img" />
                  </div>
                  <div className="request-project__info-wrapper">
                    <div className="request-project__info-title">
                      {message.projectName}
                    </div>
                    <div className="request-project__info-leader-wrapper">
                      <i className="bx bxs-crown"></i>
                      <div className="leader-img__wrapper">
                        <img src={message.leader.profileImg} alt="img" />
                      </div>
                      <div className="leader-name">{message.leader.name}</div>
                    </div>
                  </div>
                </div>
                {message.state === 'pending' || message.state === 'resolve' ? (
                  <React.Fragment>
                    {message.state === 'pending' ? (
                      <div className="request-state__wrapper">
                        <span>대기중</span>
                      </div>
                    ) : (
                      <div className="request-state__wrapper state-resolve">
                        <span>승인</span>
                        <input
                          type="button"
                          className="request-state__btn"
                          value="Join"
                          name={message.projectId}
                          onClick={joinProject}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {message.state === 'request' ? (
                      <div className="request-state__wrapper state-request">
                        <span>요청</span>
                        <input
                          name={message.projectId}
                          onClick={joinProject}
                          type="button"
                          className="request-state__btn"
                          value="Join"
                        />
                        <input
                          name={message.projectId}
                          onClick={rejectProject}
                          type="button"
                          className="request-state__btn"
                          value="Reject"
                        />
                      </div>
                    ) : (
                      <div className="request-state__wrapper">
                        <span>거부</span>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="requestCard__no-message">
          <span>No Messages</span>
        </div>
      )}
    </div>
  );
};

export default ProfileRequestCard;
