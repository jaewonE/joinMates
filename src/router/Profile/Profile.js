import React, { useState } from 'react';
import ProfileNavigation from 'router/Profile/ProfileNavigation';
import ProfileCard from 'router/Profile/ProfileCard';
import ProfileJoinProjectCard from 'router/Profile/ProfileJoinProjectCard';
import ProfileRequestCard from 'router/Profile/ProfileRequestCard';

const Profile = ({ userObj, setUserObj }) => {
  const [isUserInfoCard, setIsUserInfoCard] = useState(true);
  const [isJoinProjectCard, setIsJoinProjectCard] = useState(false);
  const [isRequestMessageCard, setIsRequestMessageCard] = useState(false);
  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <ProfileNavigation
          setIsUserInfoCard={setIsUserInfoCard}
          setIsJoinProjectCard={setIsJoinProjectCard}
          setIsRequestMessageCard={setIsRequestMessageCard}
        />
        {isUserInfoCard && (
          <ProfileCard userObj={userObj} setUserObj={setUserObj} />
        )}
        {isJoinProjectCard && (
          <ProfileJoinProjectCard userObj={userObj} setUserObj={setUserObj} />
        )}
        {isRequestMessageCard && (
          <ProfileRequestCard userObj={userObj} setUserObj={setUserObj} />
        )}
      </div>
    </div>
  );
};

export default Profile;
