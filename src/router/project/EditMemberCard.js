import { releaseProjectMember } from 'components/fComponents';
import React, { useState } from 'react';

const EditMemberCard = ({ projectObj, userObj }) => {
  const [userObjList, setUserObjList] = useState(projectObj.userObjList);
  const [cardMember, setCardMember] = useState(null);
  const releaseMember = async (e) => {
    const {
      target: { name },
    } = e;
    if (userObj.userId === name) {
      alert('리더는 프로젝트에서 제외할 수 없습니다');
    } else {
      const relaseUserName = await releaseProjectMember(
        projectObj.projectInfo.projectId,
        name
      );
      let newUserObjList = [];
      for (let i = 0; i < Array.from(userObjList).length; i++) {
        if (userObjList[i].userId !== name) {
          newUserObjList.push(userObjList[i]);
        }
      }
      alert(`${relaseUserName}은 자유를 찾아 떠났습니다`);
      setUserObjList(newUserObjList);
    }
  };
  return (
    <div className="editMember-wrapper">
      <div className="editMember-listwrapper">
        <div className="editMember-title">Members</div>
        <ul className="editMember__memberList">
          {userObjList.map((memberObj, index) => {
            return (
              <li
                key={index}
                onClick={() => setCardMember(memberObj)}
                className="editMember__member"
              >
                <div className="editMember__member-index">{index + 1}</div>
                <div className="editMember__info-wrapper">
                  <span className="editMember__info-name">
                    {memberObj.name}
                  </span>
                  <span className="editMember__info-email">
                    {memberObj.email}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="editMember__memberCard-container">
        {cardMember ? (
          <div className="memberCard-wrapper">
            <div className="memberCard__img-wrapper">
              <img src={cardMember.profileImg} alt="img" />
            </div>
            <div className="memberCard__info">
              <span className="memberCard__info-name">{cardMember.name}</span>
              <span className="memberCard__info-email">{cardMember.email}</span>
            </div>
            <input
              type="button"
              name={cardMember.userId}
              onClick={releaseMember}
              value="Release"
            />
          </div>
        ) : (
          <div className="empty-memberCard">Select Member</div>
        )}
      </div>
    </div>
  );
};

export default EditMemberCard;
