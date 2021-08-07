import React, { useState } from 'react';
import ProfileNavigation from 'components/ProfileNavigation';
import ProfileCard from 'router/ProfileCard';
import ProfileJoinProjectCard from './ProfileJoinProjectCard';

const Profile = ({ userObj, setUserObj }) => {
  const [isProfileCard, setIsProfileCard] = useState(true);
  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <ProfileNavigation setIsProfileCard={setIsProfileCard} />
        {isProfileCard ? (
          <ProfileCard userObj={userObj} setUserObj={setUserObj} />
        ) : (
          <ProfileJoinProjectCard userObj={userObj} setUserObj={setUserObj} />
        )}
      </div>
    </div>
  );
};

export default Profile;
