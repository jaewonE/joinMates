import React, { useEffect, useState } from "react";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";

const Setting = ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onChange = (event) => {
      const {
        target: { value },
      } = event;
      setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
      event.preventDefault();
      if (userObj.displayName !== newDisplayName) {
        await userObj.updateProfile({
          displayName: newDisplayName,
        });
        await refreshUser();
      }
    };
    const onLogOutClick = () => {
        const ok = window.confirm("Are you sure you want to log out?");
        if(ok) {
            authService.signOut();
            refreshUser("clear");
            history.push("/");
        }
    }
    useEffect(()=> {
      console.log("setting");
      console.log(userObj);
    },[userObj]);
    return (
        <div className="container">
          <form onSubmit={onSubmit} className="profileForm">
            <input
              onChange={onChange}
              type="text"
              autoFocus
              placeholder="Display name"
              value={newDisplayName}
              className="formInput"
            />
            <input
              type="submit"
              value="Update Profile"
              className="formBtn"
            />
          </form>
          <span onClick={onLogOutClick}>
            Log Out
          </span>
        </div>
      );
}

export default Setting;
