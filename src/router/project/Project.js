import { getProjectInfo } from 'components/fComponents';
import React, { useEffect, useRef, useState } from 'react';
import Chat from 'router/project/Chat';
import ProjectNavigation from 'router/project/ProjectNavigation';
import CreateNewChatroom from 'router/project/CreateNewChatroom';
import EditProjectInfo from 'router/project/EditProjectInfo';

const Project = ({
  userObj,
  setUserObj,
  projectPath,
  chatroomPath,
  setChatroomPath,
}) => {
  const [projectObj, setProjectObj] = useState(null);
  const stopBringProjectObj = useRef(null);
  const [editProjectInfo, setEditProjectInfo] = useState(false);

  useEffect(() => {
    setEditProjectInfo(false);
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
            setEditProjectInfo={setEditProjectInfo}
          />
          <React.Fragment>
            {editProjectInfo ? (
              <EditProjectInfo projectObj={projectObj} userObj={userObj} />
            ) : (
              <React.Fragment>
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
            )}
          </React.Fragment>
        </React.Fragment>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Project;
