import React, {useState, useEffect} from 'react';
import googlelogo from 'router/Google_icon.png';
import { authService, firebaseInstance } from 'fbase';
import './Auth.css';

function useSetSlideUpEvent() {
    const [pageState, setPageState] = useState("signup");
    const [isLoginPage, setLoginPage] = useState(true);
    const changePage = () => {
        const signupBtn = document.getElementById('signup');
        const signupBtnParent = signupBtn.parentNode.parentNode;
        const login = document.getElementById('login');
        const loginParent = login.parentNode;
        const slideUpClassName = 'slide-up';
        if(pageState === "login") {
            loginParent.classList.add(slideUpClassName);
            signupBtnParent.classList.remove(slideUpClassName);
            setLoginPage(false);
        }else if(pageState==="signup"){
            loginParent.classList.remove(slideUpClassName);
            signupBtnParent.classList.add(slideUpClassName);
            setLoginPage(true);
        }
    }
    useEffect(changePage, [pageState]);
    return {isLoginPage, setPageState};
}

function Auth ({setUserObj}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("set_your_name");
    const {isLoginPage, setPageState} = useSetSlideUpEvent();
    const [trySuccess, setTrySuccess] = useState(false);
    const transitFormSignup = () => {
        document.getElementById('login').classList.remove('opacity0');
    }
    const transitFormLogin = () => {
        document.getElementById('login').classList.add('opacity0');
    }
    const changePage = (e) => {
        let type = e.target.id;
        if(type==="signup") {
            setPageState("login");
            transitFormSignup();
        }else if(type==="login") {
            setPageState("signup");
            transitFormLogin();
        }
    }
    const onChange = (e) => {
        let {name, value} = e.target;
        if(name==="email") {
            setEmail(value);
        }else if(name==="password") {
            setPassword(value);
        }else if(name==="userName") {
            setDisplayName(value);
        }
    }
    const setUserInfo = async() => {
        const user = authService.currentUser;
        await setUserObj({
            displayName: displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
        });
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        try {
            if(isLoginPage) {
                await authService.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
            }else {
                await authService.createUserWithEmailAndPassword(email, password).catch((error) => alert(error.message));
            }
            setTrySuccess(true);
        } catch (error) {
            console.error(error);
            alert("Error in Login\nPlease check your console");
            setTrySuccess(false);
        } 
        if(trySuccess) { await setUserInfo(); };
    }
    const googleAccount = async() => {
        let provider;
        provider = new firebaseInstance.auth.GoogleAuthProvider();
        let data = firebaseInstance.auth().signInWithPopup(provider)
        await data.catch((error) => alert(error.message));
    }
    return(
        <div className="form-structor">
            <h1 id="app-name">JoinMates</h1>
            <form onSubmit={onSubmit} className="signup">
                <h2 onClick={changePage} className="form-title opacity0" id="login"><span>or</span>Log in</h2>
                <div className="form-holder">
                    <input required name="email" onChange={onChange} type="email" className="input" placeholder="Email" />
                    <input required name="password" onChange={onChange} type="password" className="input" placeholder="Password" />
                </div>
                <input value="Log in" type="submit" className="submit-btn" />
                <button onClick={googleAccount} className="google_account">
                    <img alt="google_icon" id="google_icon" src={googlelogo} />
                    <span id="google_span">{isLoginPage ? "Login with Google" : "Sign up with Google"}</span>
                </button>
            </form>
            <form onSubmit={onSubmit} className="login slide-up">
                <div className="center">
                <h2 onClick={changePage} className="form-title" id="signup"><span>or</span>Sign up</h2>
                <div className="form-holder">
                <input required name="userName" onChange={onChange} type="text" maxLength="15" className="input" placeholder="Name" />
                <input required name="email" onChange={onChange} type="email" className="input" placeholder="Email" />
                <input required name="password" onChange={onChange} type="password" className="input" placeholder="Password" />
                </div>
                <input value="Sign up" type="submit" className="submit-btn" />
                <button onClick={googleAccount} className="google_account">
                    <img alt="google_icon" id="google_icon" src={googlelogo} />
                    <span id="google_span">{isLoginPage ? "Login with Google" : "Sign up with Google"}</span>
                </button>
                </div>
            </form>
        </div>
    )
}

export default Auth;
 