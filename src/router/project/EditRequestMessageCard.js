import { addProjectMember, rejectRequestMember } from 'components/fComponents';
import React, { useEffect, useState } from 'react';

const EditRequestMessageCard = ({ projectObj }) => {
  const [requestList, setRequestList] = useState(
    Array.from(projectObj.requestUserList)
  );
  const submitMember = async (e) => {
    const {
      target: { value, name },
    } = e;
    if (value === 'Permit') {
      const requestMessages = await addProjectMember(
        projectObj.projectInfo.projectId,
        name
      );
      setRequestList(requestMessages);
    } else if (value === 'Refuse') {
      const requestMessages = await rejectRequestMember(
        projectObj.projectInfo.projectId,
        name
      );
      setRequestList(requestMessages);
    }
  };
  return (
    <div className="editRequest-wrapper">
      {requestList.length ? (
        <ul className="editRequestList-wrapper">
          {requestList.map((message, index) => {
            return (
              <li key={message.userId} className="requestMember-wrapper">
                <div className="requestMember__marked"></div>
                <div className="requestMember__index">{index + 1}</div>
                <div className="requestMember-container">
                  <div className="requestMember__img-wrapper">
                    <img src={message.profileImg} alt="img" />
                  </div>
                  <div className="requestMember__info-wrapper">
                    <div className="requestMember__info-name">
                      {message.userName}
                    </div>
                    <div className="requestMember__info-email">
                      {message.email}
                    </div>
                  </div>
                </div>
                <div className="requestMember__check-wrapper">
                  <input
                    type="button"
                    value="Permit"
                    name={message.userId}
                    onClick={submitMember}
                  />
                  <input
                    type="button"
                    value="Refuse"
                    name={message.userId}
                    onClick={submitMember}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="NoEditRequest-wrapper">No Messages</div>
      )}
    </div>
  );
};

export default EditRequestMessageCard;
