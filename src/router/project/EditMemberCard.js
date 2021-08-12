import React, { useState } from 'react';

const EditMemberCard = ({ projectObj }) => {
  const [userObjList, setUserObjList] = useState(projectObj.userObjList);
  const [cardMember, setCardMember] = useState(null);
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
            <input type="button" value="Release" />
          </div>
        ) : (
          <div className="empty-memberCard">Select Member</div>
        )}
      </div>
    </div>
  );
};

export default EditMemberCard;
