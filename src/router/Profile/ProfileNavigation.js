import React from 'react';

const ProfileNavigation = ({
  setIsUserInfoCard,
  setIsJoinProjectCard,
  setIsRequestMessageCard,
}) => {
  const setCard = (e) => {
    const {
      target: { id },
    } = e;
    const profileBtn = document.querySelector('#navi-profile');
    const joinProjectBtn = document.querySelector('#navi-joinProject');
    const requestMessage = document.querySelector('#navi-requestMessage');
    profileBtn.classList.remove('focus');
    joinProjectBtn.classList.remove('focus');
    requestMessage.classList.remove('focus');
    if (id === 'navi-profile') {
      profileBtn.classList.add('focus');
      setIsRequestMessageCard(false);
      setIsJoinProjectCard(false);
      setIsUserInfoCard(true);
    } else if (id === 'navi-joinProject') {
      joinProjectBtn.classList.add('focus');
      setIsRequestMessageCard(false);
      setIsUserInfoCard(false);
      setIsJoinProjectCard(true);
    } else if (id === 'navi-requestMessage') {
      requestMessage.classList.add('focus');
      setIsUserInfoCard(false);
      setIsJoinProjectCard(false);
      setIsRequestMessageCard(true);
    }
  };
  return (
    <div className="profileNavigation-wrapper">
      <div className="profile-navi focus" id="navi-profile" onClick={setCard}>
        <span>Profile</span>
      </div>
      <div className="profile-navi" id="navi-joinProject" onClick={setCard}>
        <span>Join Project</span>
      </div>
      <div className="profile-navi" id="navi-requestMessage" onClick={setCard}>
        <span>Request Messages</span>
      </div>
    </div>
  );
};

export default ProfileNavigation;
