import React, {useState} from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom"; //npm install react-router-dom
import Auth from 'router/Auth';
import Home from 'router/Home';
import { authService } from 'fbase';
import Chat from 'router/Chat';

function AppRouter() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [setting, setSetting] = useState(false);
    authService.onAuthStateChanged((user) => {
        if(user) {
            setIsLoggedIn(true);
        }else {
            setIsLoggedIn(false);
        }
        setSetting(true);
    })
    return(
        <Router>
            {setting ? (
                            <Switch>
                            {
                                isLoggedIn ? (
                                    <React.Fragment>
                                        <Route exact path="/">
                                            <Home />
                                        </Route>
                                        <Route exact path="/chat">
                                            <Chat />
                                        </Route>
                                    </React.Fragment>
                                ):(
                                    <Route exact path="/">
                                        <Auth />
                                    </Route>
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