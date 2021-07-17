import React, {useEffect, useState} from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom"; //npm install react-router-dom
import Auth from 'router/Auth';
import { authService } from 'fbase';
import Navigation from 'components/Navigation';
import Pchat from 'router/Pchat';
import Profile from 'router/Profile';
import Tchat from 'router/Tchat';
import Setting from 'router/Setting';

function AppRouter() {
    const [setting, setSetting] = useState(false);
    const [userObj, setUserObj] = useState(null);
    useEffect(() => {
        authService.onAuthStateChanged((user) => {

            if (user) {
                let displayName = user.displayName;
                if(displayName === null || displayName === undefined) {
                displayName = "set_your_name";
                };
                setUserObj({
                    displayName,
                    uid: user.uid,
                    updateProfile: (args) => user.updateProfile(args),
                });
            } else {
                setUserObj(null);
            }
            setSetting(true);
        });
      }, []);
    const refreshUser = (ref) => {
        if(ref) {
            console.log("refreshUser Null");
            setUserObj(null);
        } else {
            const user = authService.currentUser;
            console.log("refreshUser");
            console.log("displayName: "+ user.displayName);
            setUserObj({
                displayName: user.displayName,
                uid: user.uid,
                updateProfile: (args) => user.updateProfile(args)
                .then(()=> console.log("update profile success"))
                .catch((e)=> console.log(e)),
            });
        }
      };
    return(
        <Router>
            {setting ? (
                            <Switch>
                            {
                                Boolean(userObj) ? (
                                    <React.Fragment>
                                        <Navigation />
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
                                            <Auth setUserObj={setUserObj}/>
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