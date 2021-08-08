import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import {
  getUserObject,
  onAuthStateChanged,
  updateUserObj,
} from 'components/fComponents';
import Auth from 'router/Auth';
import Navigation from 'components/Navigation';
import Profile from 'router/Profile/Profile';
import Setting from 'router/Setting';
import Project from 'router/project/Project';
import CreateNewProject from 'router/project/CreateNewProject';

function useRedirectCreateProjectPage(setProjectPath) {
  const [createProjectName, setCreateProjectName] = useState(null);
  useEffect(() => {
    if (createProjectName) {
      setTimeout(() => {
        setProjectPath(createProjectName);
        setCreateProjectName(null);
      }, 500);
    }
  }, [createProjectName, setProjectPath]);
  return { createProjectName, setCreateProjectName };
}

function AppRouter() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projectPath, setProjectPath] = useState('');
  const [chatroomPath, setChatroomPath] = useState('');
  const [hashHistory, setHashHistory] = useState('');
  const [userObj, setUserObj] = useState(null);
  const { createProjectName, setCreateProjectName } =
    useRedirectCreateProjectPage(setProjectPath);
  const didAuthMountRef = useRef(false);
  const didUserObjMountRef = useRef(false);
  const didSetMountRef = useRef(false);

  const searchMatchProject = (userObj, projectName, chatroomName = '') => {
    let lastEditedProjectList = userObj.lastEditedProjectList;
    for (let i = 0; i < lastEditedProjectList.length; i++) {
      if (lastEditedProjectList[i].projectPath.name === projectName) {
        if (chatroomName) {
          lastEditedProjectList[i].chatroomPath = chatroomName;
          setUserObj({
            ...userObj,
            lastEditedProjectList,
          });
        }
        return lastEditedProjectList[i];
      }
    }
    return null;
  };

  useEffect(() => {
    const uploadUserObj = async () => {
      await updateUserObj(userObj);
    };
    if (didUserObjMountRef.current) {
      uploadUserObj();
    } else didUserObjMountRef.current = true;
  }, [userObj]);

  const set = useCallback(() => {
    const decodeHash = decodeURI(window.location.hash);
    if (decodeHash !== hashHistory) {
      const isProjectHash = '#/project/';
      const isProject = decodeHash.indexOf(isProjectHash);
      if (userObj) {
        if (isProject) {
          //is not project
          setProjectPath('');
          setChatroomPath('');
        } else {
          //is project
          const projectHashRef = decodeHash.slice(isProjectHash.length);
          const hashIndex = projectHashRef.indexOf('#');
          if (hashIndex + 1) {
            //url has info of chatroom
            const projectHash = projectHashRef.slice(0, hashIndex);
            const chatroomHash = projectHashRef.slice(hashIndex + 1);
            const projectHashObj = searchMatchProject(
              userObj,
              projectHash,
              chatroomHash
            );
            setChatroomPath(chatroomHash);
            setProjectPath(projectHashObj.projectPath);
          } else {
            //no info of chatroom
            const projectHashObj = searchMatchProject(
              userObj,
              projectHashRef,
              ''
            );
            setChatroomPath(projectHashObj.chatroomPath);
            setProjectPath(projectHashObj.projectPath);
          }
        }
      } else {
        console.error('no user Obj');
      }
    }
    setHashHistory(decodeHash);
  }, [hashHistory, userObj]);

  useEffect(() => {
    if (userObj) {
      if (!didSetMountRef.current) {
        set();
        didSetMountRef.current = true;
      }
      window.addEventListener('hashchange', set);
    }
    return () => window.removeEventListener('hashchange', set);
  }, [userObj, set]);

  useEffect(() => {
    const getAndSetUserObj = async () => {
      const user = await getUserObject();
      setUserObj(user); //로드의 트리거
    };
    if (didAuthMountRef.current) {
      if (isLoggedIn) {
        getAndSetUserObj();
      }
    } else {
      onAuthStateChanged({ setInit, setIsLoggedIn });
      didAuthMountRef.current = true;
    }
  }, [isLoggedIn, setUserObj]);

  return (
    <React.Fragment>
      {init ? (
        <Router>
          {isLoggedIn && userObj && <Navigation userObj={userObj} />}
          <Switch>
            <React.Fragment>
              {isLoggedIn ? (
                <React.Fragment>
                  {userObj && (
                    <React.Fragment>
                      <Route exact path="/">
                        <Redirect to="/profile" />
                      </Route>
                      <Route exact path="/project/:projectPathName">
                        {projectPath && (
                          <Project
                            userObj={userObj}
                            setUserObj={setUserObj}
                            projectPath={projectPath}
                            chatroomPath={chatroomPath}
                            setChatroomPath={setChatroomPath}
                          />
                        )}
                      </Route>
                      {createProjectName ? (
                        <Route exact path="/project">
                          <Redirect
                            to={{
                              pathname: `/project/${createProjectName.name}`,
                              state: { fromDashboard: true },
                            }}
                          />
                        </Route>
                      ) : (
                        <Route exact path="/project">
                          <CreateNewProject
                            userObj={userObj}
                            setUserObj={setUserObj}
                            setCreateProjectName={setCreateProjectName}
                          />
                        </Route>
                      )}
                      <Route exact path="/setting">
                        <Setting userObj={userObj} setUserObj={setUserObj} />
                      </Route>
                      <Route exact path="/profile">
                        <Profile userObj={userObj} setUserObj={setUserObj} />
                      </Route>
                    </React.Fragment>
                  )}
                </React.Fragment>
              ) : (
                <div id="auth-container">
                  <Route path="/">
                    <Auth />
                  </Route>
                </div>
              )}
            </React.Fragment>
          </Switch>
        </Router>
      ) : (
        <div className="initializing-div">
          <img
            src="https://i.ytimg.com/vi/zwzPeHNp9Ms/maxresdefault.jpg"
            alt="Initializing_Image"
            id="initializing-img"
          />
          <footer>&copy; {new Date().getFullYear()}JoinMates</footer>
        </div>
      )}
    </React.Fragment>
  );
}

export default AppRouter;

/*
문제가 무었인가.
순서
1. 로그인 상태를 확인
2. 로그인이 되었다면 userObj를 반환하고 그렇지 않으면 null값을 return한다. 
3. userObj가 존재하면 내용이 담긴 component, 그렇지 않으면 auth 창을 보여준다. 

네비게이션에서 링크를 통해 이동하면 해시가 바뀐다. 이것을 addEventListener를 두어 해시 채인지를 감지하여 projectPath와 chatroomPath를 체크한다.
여기서 문제!
프로젝트 창에서 새로고침을 하였는 경우 이벤트가 실행되는 것이 아닌 이벤트 르스너가 설치 되는 것임으로 projectPath와 chatroomPath가 존재하지 않는다. 
*/
