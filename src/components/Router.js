import React, {useEffect, useState} from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom"; //npm install react-router-dom
import Auth from 'router/Auth';
import { authService } from 'fbase';
import Navigation from 'components/Navigation';
import Pchat from 'router/Pchat';
import Profile from 'router/Profile';
import Tchat from 'router/Tchat';
import Setting from 'router/Setting';
import Lab from 'router/Lab';

function AppRouter() {
    const [setting, setSetting] = useState(false);
    const [userObj, setUserObj] = useState(null);
    const [inputName, setDisplayName] = useState("set_your_name");
    const refreshUser = (ref) => {
        if(ref) {
            setUserObj(null);
        } else {
            const user = authService.currentUser;
            setUserObj({
                ...userObj,
                displayName: user.displayName,
            });
        }
      };
    useEffect(() => {
        const setUserInfo = (inputName) => {
            authService.onAuthStateChanged((user) => {
                if (user) {
                    let displayName = user.displayName;
                    if(inputName === "") {
                        displayName = "set_your_name";
                    } else {
                        displayName = inputName;
                    }
                    let profile_img = user.photoURL;
                    if(profile_img === null || profile_img === undefined) {
                        profile_img = "";
                    }
                    setUserObj({
                        email: user.email,
                        displayName,
                        uid: user.uid,
                        profile_img,
                        updateProfile: (args) => user.updateProfile(args)
                    });
                } else {
                    setUserObj(null);
                }
                setSetting(true);
            });
        };
        const setUserList = () => {
            console.log("setUserList");
            console.log(userObj);
        }
        setUserInfo(inputName);
        setUserList(userObj);
    }, [userObj]);
    return(
        <Router>
            {setting ? (
                            <Switch>
                            {
                                Boolean(userObj) ? (
                                    <React.Fragment>
                                        <Navigation />
                                            <div className="container">
                                                <Route exact path="/">
                                                    <Redirect to="/auth" />
                                                </Route>
                                                <Route exact path="/auth">
                                                    <Redirect to="/tchat" />
                                                </Route>
                                                <Route exact path="/profile">
                                                    <Profile />
                                                </Route>
                                                <Route exact path="/pchat">
                                                    <Pchat />
                                                </Route>
                                                <Route exact path="/tchat">
                                                    <Tchat userObj={userObj}/>
                                                </Route>
                                                <Route exact path="/setting">
                                                    <Setting refreshUser={refreshUser} userObj={userObj} />
                                                </Route>
                                                <Route exact path="/lab">
                                                    <Lab userObj={userObj}/>
                                                </Route>
                                            </div>
                                    </React.Fragment>
                                ):(
                                    <React.Fragment>
                                        <Route exact path="/">
                                            <Redirect to="/auth" />
                                        </Route>
                                        <Route exact path="/tchat">
                                            <Redirect to="/auth" />
                                        </Route>
                                        <Route exact path="/auth">
                                            <Auth setDisplayName={setDisplayName}/>
                                        </Route>
                                    </React.Fragment>
                                )
                            }
                        </Switch>
            ) : (
                "Loading..."
            )}
        </Router>
    );
}

export default AppRouter;