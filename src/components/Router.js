import React, {useEffect, useState} from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom"; //npm install react-router-dom
import {onAuthStateChanged} from 'components/fComponents';
import Auth from 'router/Auth';
import Navigation from 'components/Navigation';
import Profile from 'router/Profile';
import Setting from 'router/Setting';
import Project from 'router/Project';
import CreateNewProject from 'router/CreateNewProject';

function AppRouter() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentProject, setCurrentProject] = useState("");
    const projectList = ['project1', 'project2', 'project3'];
    //임시로 projectList 사용. 나중에 userInfo에서 projectList 가져올 것

    const hashChangeListener = () => {
        const hash = document.location.hash;
        console.log("hash: " + hash);
        const hashIndex = hash.indexOf('/project#');
        if(hashIndex === -1) {
            console.log("not project");
        } else {
            const projectName = hash.substring(hashIndex + '/project#'.length, );
            setCurrentProject(projectName);
        }
    }

    useEffect(() => {
        onAuthStateChanged({setInit, setIsLoggedIn});
        window.addEventListener('hashchange', hashChangeListener, false);
        return () => {
            window.removeEventListener('hashchange', hashChangeListener, false);
        }
    }, []);
    return (
        <React.Fragment>
            {init ? (
                <Router>
                    {isLoggedIn && <Navigation projectList={projectList}/>}
                    <Switch>
                        <React.Fragment>
                            {isLoggedIn ? (
                                <React.Fragment>
                                    <Route exact path='/'>
                                        <Redirect to="/project" />
                                    </Route>
                                    <Route exact path="/project">
                                        <Project currentProject={currentProject}/>
                                    </Route>
                                    <Route exact path="/project/new">
                                        <CreateNewProject />
                                    </Route>
                                    <Route exact path="/setting">
                                        <Setting />
                                    </Route>
                                    <Route exact path="/profile">
                                        <Profile setIsLoggedIn={setIsLoggedIn}/>
                                    </Route>
                                </React.Fragment>
                            ):(
                                <div id="auth-container">
                                    <Route exact path="/">
                                        <Auth />
                                    </Route>
                                </div>
                            )}
                        </React.Fragment>
                    </Switch>
                </Router>
            ):(
                <div>
                    "Initializing..."
                    <footer>&copy; {new Date().getFullYear()}JoinMates</footer>
              </div>
            )}
        </React.Fragment>
    )
}

export default AppRouter;

