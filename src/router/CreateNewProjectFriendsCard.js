import { findUserWithEmail } from 'components/fComponents';
import React, { useRef, useState } from 'react';

const CreateNewProjectFriendsCard = ({
  userObj,
  handleClick,
  memberList,
  setMemberList,
}) => {
  const [friendsSearchValue, setFriendsSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchingResult, setSearchingResult] = useState(null);
  const [noSearchResultMessage, setNoSearchResultMessage] = useState('');
  const friendWrapperDone = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (friendWrapperDone.current) {
      handleClick(e);
    } else {
      setIsSearching(true);
      const lowerValue = String(friendsSearchValue).toLowerCase();
      const userInfo = await findUserWithEmail(lowerValue);
      if (userInfo) {
        setSearchingResult(userInfo);
      } else {
        setNoSearchResultMessage('No User Found');
      }
      setIsSearching(false);
    }
  };
  const onChangeEmail = (e) => {
    const {
      target: { value },
    } = e;
    setIsSearching(false);
    setSearchingResult(null);
    setNoSearchResultMessage('');
    setFriendsSearchValue(value);
  };
  const onClickFriendsWrapper = (e) => {
    friendWrapperDone.current = true;
    handleSubmit(e);
  };
  const addMembers = () => {
    if (userObj.userId === searchingResult.userId) {
      alert('You are already a member');
    } else {
      setMemberList([...memberList, searchingResult]);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="createNewProject-card friends-wrapper"
    >
      <div className="friends-title">
        <span>Select members</span>
        <input
          type="email"
          value={friendsSearchValue}
          onChange={onChangeEmail}
          placeholder="Enter members email"
        />
        <i className="bx bx-search"></i>
      </div>

      <div className="friends-searchResult">
        {isSearching ? (
          <div className="friends-loading">
            <span className="friends-loading__loader">
              <span className="friends-loading__loader-inner"></span>
            </span>
            <span className="friends-loading__title">Searching</span>
          </div>
        ) : (
          <React.Fragment>
            {searchingResult ? (
              <div className="friends-searchResult__userInfo">
                <div className="friends-searchResult__userInfo-info">
                  <img src={searchingResult.profileImg} alt="userImg" />
                  <div className="friends-searchResult__userInfo-info-span">
                    <div>{searchingResult.name}</div>
                    <span>{String(searchingResult.email).split('@')[0]}</span>
                    <span>@{String(searchingResult.email).split('@')[1]}</span>
                  </div>
                </div>
                <input type="button" onClick={addMembers} value="Add Member" />
              </div>
            ) : (
              <div className="noSearchResult">{noSearchResultMessage}</div>
            )}
          </React.Fragment>
        )}
      </div>
      <ul className="friends-memberList-wrapper">
        {memberList.map((member) => {
          return (
            <li key={member.email} className="friends-memberList-memeber">
              <img src={member.profileImg} alt="img" />
              <span>{member.name}</span>
            </li>
          );
        })}
      </ul>
      <input
        className="card-submit"
        id="friends-wrapper__card-submit"
        type="button"
        onClick={onClickFriendsWrapper}
        value="Continue"
      />
    </form>
  );
};

export default CreateNewProjectFriendsCard;
