import React from 'react';

const ProfileNavigation = ({ setIsProfileCard }) => {
  const setCard = (e) => {
    const {
      target: { id },
    } = e;
    const profileBtn = document.querySelector('#navi-profile');
    const joinProjectBtn = document.querySelector('#navi-joinProject');
    if (id === 'navi-profile') {
      profileBtn.classList.add('focus');
      joinProjectBtn.classList.remove('focus');
      setIsProfileCard(true);
    } else if (id === 'navi-joinProject') {
      profileBtn.classList.remove('focus');
      joinProjectBtn.classList.add('focus');
      setIsProfileCard(false);
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
    </div>
  );
};

export default ProfileNavigation;
