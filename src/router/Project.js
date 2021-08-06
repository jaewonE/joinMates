import { getProjectInfo } from 'components/fComponents';
import React, { useEffect, useRef, useState } from 'react';
import Chat from 'router/Chat';
import ProjectNavigation from 'components/ProjectNavigation';
import CreateNewChatroom from 'router/CreateNewChatroom';

const Project = ({
  userObj,
  setUserObj,
  projectPath,
  chatroomPath,
  setChatroomPath,
}) => {
  const [projectObj, setProjectObj] = useState(null); //projectObj가 변하는 경우는 채널이 생성되었거나 새로운 유저가 추가되었을 때
  const stopBringProjectObj = useRef(null);

  useEffect(() => {
    const bringProjectStartInfo = async (projectPath_ID) => {
      const stopBringProjectObject = await getProjectInfo(
        projectPath_ID,
        setProjectObj
      );
      stopBringProjectObj.current = stopBringProjectObject;
    };
    if (stopBringProjectObj.current) {
      stopBringProjectObj.current();
      stopBringProjectObj.current = null;
    }
    bringProjectStartInfo(projectPath.id);
  }, [projectPath]);

  return (
    <div className="project-container">
      {projectObj ? (
        <React.Fragment>
          <ProjectNavigation
            userObj={userObj}
            setUserObj={setUserObj}
            projectPath={projectPath}
            projectObj={projectObj}
            setChatroomPath={setChatroomPath}
          />
          {chatroomPath ? (
            <Chat
              userObj={userObj}
              projectObj={projectObj}
              projectPath={projectPath}
              chatroomPath={chatroomPath}
            />
          ) : (
            <CreateNewChatroom
              userObj={userObj}
              setUserObj={setUserObj}
              projectPath={projectPath}
              setChatroomPath={setChatroomPath}
            />
          )}
        </React.Fragment>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Project;
