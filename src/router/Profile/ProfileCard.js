import React, { useState } from 'react';
import {
  signOut,
  deleteAccount,
  updatePassword,
  updateEmail,
  updateUserName,
  updateUserProfileImg,
} from 'components/fComponents';

const ProfileCard = ({ userObj, setUserObj }) => {
  const [userName, setUserName] = useState(userObj.userName);
  const [email, setEmail] = useState(userObj.email);
  const [isEditPassword, setIdEditPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileImg, setProfileImg] = useState(userObj.photoURL);
  const onChange = (e) => {
    let { id, value } = e.target;
    if (id === 'email') {
      setEmail(value);
    } else if (id === 'userName') {
      setUserName(value);
    }
  };
  const onChangePassword = (e) => {
    let { id, value } = e.target;
    if (id === 'oldPassword') {
      setOldPassword(value);
    } else if (id === 'newPassword') {
      setNewPassword(value);
    } else if (id === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }
  };
  const getComfirm = (name) => {
    const comfirmRef = window.confirm(
      `정말로 ${name}하기를 원하십니까?\n이 과정은 되돌릴 수 없습니다`
    );
    if (comfirmRef) {
      return true;
    } else {
      return false;
    }
  };
  const logOut = (event) => {
    event.preventDefault();
    const confirmRef = getComfirm('로그아웃');
    if (confirmRef) {
      signOut();
    }
  };
  const deleteUser = (event) => {
    event.preventDefault();
    const confirmRef = getComfirm('탈퇴');
    if (confirmRef) {
      deleteAccount();
    }
  };
  const changeProfileImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async (evt) => {
        const imgURL = await evt.currentTarget.result;
        const imageURL = await updateUserProfileImg(userObj, imgURL);
        setUserObj({
          ...userObj,
          photoURL: imageURL,
        });
        setProfileImg(imageURL);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };
  const editPassword = () => {
    setIdEditPassword((prev) => !prev);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };
  const changePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('새로운 비밀번호가 다시확인된 비밀번호와 같지 않습니다');
    } else {
      await updatePassword(oldPassword, newPassword);
      editPassword();
    }
  };
  const changeUserEmail = async () => {
    await updateEmail(email);
    setUserObj({
      ...userObj,
      email,
    });
  };
  const changeUserName = async () => {
    await updateUserName(userName);
    setUserObj({
      ...userObj,
      userName,
    });
  };

  return (
    <React.Fragment>
      <div className="editProfile-wrapper">
        <div className="profileImg-wrapper">
          <img src={profileImg} alt="Profile_img" />
          <label htmlFor="uploadImg">Change Profile Image</label>
          <input
            type="file"
            id="uploadImg"
            accept="image/*"
            onChange={changeProfileImg}
          />
        </div>
        <React.Fragment>
          {isEditPassword ? (
            <form className="changePassword" onSubmit={changePassword}>
              <input
                type="button"
                onClick={editPassword}
                value="Go Back"
                id="profile-info__go-back"
              />
              <div className="_label" htmlFor="oldPassword">
                Current Password
              </div>
              <input
                className="_input"
                required
                onChange={onChangePassword}
                value={oldPassword}
                type="password"
                id="oldPassword"
              />
              <div className="_label" htmlFor="newPassword">
                New Password
              </div>
              <input
                className="_input"
                required
                onChange={onChangePassword}
                value={newPassword}
                type="password"
                id="newPassword"
              />
              <div className="_label" htmlFor="confirmNewPassword">
                Confirm New Password
              </div>
              <input
                className="_input"
                required
                onChange={onChangePassword}
                value={confirmNewPassword}
                type="password"
                id="confirmNewPassword"
              />
              <input
                className="_input _btn"
                type="submit"
                id="changePasswordBtn"
                value="Change Password"
              />
            </form>
          ) : (
            <form className="profile-info">
              <input
                className="hidden_input"
                value="Update"
                id="userName_btn"
                type="button"
                onClick={changeUserName}
              />
              <div className="_label" htmlFor="userName">
                Name
              </div>
              <input
                className="_input"
                required
                type="text"
                onChange={onChange}
                id="userName"
                value={userName}
              />
              <div className="_label" htmlFor="email">
                Email
              </div>
              <input
                className="_input"
                required
                type="email"
                onChange={onChange}
                id="email"
                value={email}
              />
              <input
                className="hidden_input"
                value="Update"
                id="email_btn"
                type="button"
                onClick={changeUserEmail}
              />
              <div className="_label" htmlFor="password">
                Password
              </div>
              <input
                className="_input _btn"
                required
                type="button"
                onClick={editPassword}
                value="Change Password"
              />
            </form>
          )}
        </React.Fragment>
      </div>
      <div className="logOut-wrapper">
        <input type="button" onClick={logOut} value="Log Out" />
        <input type="button" onClick={deleteUser} value="Delete Account" />
      </div>
    </React.Fragment>
  );
};

export default ProfileCard;
