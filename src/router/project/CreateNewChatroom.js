import { createChatroom } from 'components/fComponents';
import React, { useState } from 'react';

const CreateNewChatroom = ({
  userObj,
  setUserObj,
  projectPath,
  setChatroomPath,
}) => {
  const [inputValue, setInputValue] = useState('');
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setInputValue(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const chatroomId = await createChatroom({
      userObj,
      path: {
        projectPath,
        chatroomPath: { id: undefined, name: inputValue },
      },
    });
    const chatroomObj = { id: chatroomId, name: inputValue };
    let lastEditedProjectList = userObj.lastEditedProjectList;
    for (let i = 0; i < lastEditedProjectList.length; i++) {
      if (lastEditedProjectList[i].projectPath.name === projectPath.name) {
        lastEditedProjectList[i].chatroomPath = chatroomObj;
        setUserObj({
          ...userObj,
          lastEditedProjectList,
        });
      }
    }
    setChatroomPath(chatroomObj);
  };
  return (
    <div className="createNewChatroom-container">
      <form className="createNewChatroom-wrapper" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Enter channel name"
          onChange={onChange}
          value={inputValue}
        />
        <input type="submit" value="create channel" />
      </form>
    </div>
  );
};

export default CreateNewChatroom;
