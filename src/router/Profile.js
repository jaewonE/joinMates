import React from 'react';
import ProfileCard from 'router/ProfileCard';

const Profile = ({ userObj, setUserObj }) => {
  return (
    <div className="profile-container">
      <ProfileCard userObj={userObj} setUserObj={setUserObj} />
    </div>
  );
};

export default Profile;
