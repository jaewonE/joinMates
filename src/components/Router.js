import React, {useEffect, useState, useRef} from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import {onAuthStateChanged, getUserObject, updateUserObj} from 'components/fComponents';
import Auth from 'router/Auth';
import Navigation from 'components/Navigation';
import Profile from 'router/Profile';
import Setting from 'router/Setting';
import Project from 'router/Project';
import CreateNewProject from 'router/CreateNewProject';

function useUserObjChangedListener() {
    const [userObj, setUserObj] = useState(null);
    const mountRef = useRef(false);
    useEffect(()=> {
        const uploadUserObj = async() => {
            await updateUserObj(userObj);
        }
        if(mountRef.current) {
            uploadUserObj();
        } else mountRef.current = true;
    },[userObj]);
    return {userObj, setUserObj};
}

function AppRouter() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentProject, setCurrentProject] = useState("");
    const {userObj, setUserObj} = useUserObjChangedListener();
    const didMountRef = useRef(false);
    const projectList = ['project1', 'project2', 'project3'];
    //임시로 projectList 사용. 나중에 userInfo에서 projectList 가져올 것

    const hashChangeListener = () => {
        const hash = document.location.hash;
        const hashIndex = hash.indexOf('/project#');
        if(hashIndex === -1) {
            console.log("not project");
        } else {
            const projectName = hash.substring(hashIndex + '/project#'.length, );
            setCurrentProject(projectName);
        }
    }

    
    useEffect(() => {
        const getAndSetUserObj = async() => {
            const user = await getUserObject();
            setUserObj(user);
        }
        if(didMountRef.current) {
            if(isLoggedIn) {
                getAndSetUserObj();
            }
        } else {
            onAuthStateChanged({setInit, setIsLoggedIn});
            window.addEventListener('hashchange', hashChangeListener, false);
            didMountRef.current = true;
        }
        return () => {
            window.removeEventListener('hashchange', hashChangeListener, false);
        };
    }, [isLoggedIn, setUserObj]);
    return (
        <React.Fragment>
            {init ? (
                <Router>
                    {isLoggedIn && userObj && <Navigation projectList={projectList}/>}
                    <Switch>
                        <React.Fragment>
                        {isLoggedIn ? (
                            <React.Fragment>
                                {userObj && (
                                <React.Fragment>
                                    <Route exact path='/'>
                                        <Redirect to="/profile" />
                                    </Route>
                                    <Route exact path="/project">
                                        <Project currentProject={currentProject}/>
                                    </Route>
                                    <Route exact path="/project/new">
                                        <CreateNewProject />
                                    </Route>
                                    <Route exact path="/setting">
                                        <Setting userObj={userObj} setUserObj={setUserObj}/>
                                    </Route>
                                    <Route exact path="/profile">
                                        <Profile userObj={userObj} setUserObj={setUserObj}/>
                                    </Route>
                                </React.Fragment>
                                )}
                            </React.Fragment>
                        ):(
                            <div id="auth-container">
                                <Route path="/">
                                    <Auth />
                                </Route>
                            </div>
                        )}
                        </React.Fragment>
                    </Switch>
                </Router>
            ):(
                <div className="initializing-div">
                    <img
                    src='https://i.ytimg.com/vi/zwzPeHNp9Ms/maxresdefault.jpg'
                    alt="Initializing_Image"
                    id="initializing-img"
                    />
                    <footer>&copy; {new Date().getFullYear()}JoinMates</footer>
              </div>
            )}
        </React.Fragment>
    )
}

export default AppRouter;

