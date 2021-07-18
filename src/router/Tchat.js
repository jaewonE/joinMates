import React from 'react';
import 'router/css/Tchat.css';
import test_img from 'router/css/test_img.jpg';

const Tchat = () => {
    return (
        <React.Fragment>
            <div className="chatList-wrapper">
                <div className="chatList__header">
                    <div className="chatList__header-img">
                        <img className="profile_img sm" src={test_img} alt="profile_img"/>
                    </div>
                    <div className="chatList__header-title">Team Messages</div>
                    <div className="chatList__header-addChat">
                        <i className='bx bx-add-to-queue'></i>
                    </div>
                </div>
                <div className="chatList__search">
                    <input placeholder="Search"/>
                    <i className='bx bx-search' ></i>
                </div>
                <div className="chatList__search-margin"> </div>
                <ul className="chatList__chatWith">
                    <li className="chatWith">
                        <div className="chatWith-img-div">
                            <img className="profile_img" src={test_img} alt="profile_img"/>
                        </div>
                        <div className="chatWith-info">
                            <div className="chatWith-info__teamName">The A Squad</div>
                            <div className="chatWith-info__lastChat">
                                <span className="lastChat-message">Where are you?</span>
                                <span className="lastChat-time">‧ 14m</span>
                            </div>
                        </div>
                        <div className="chatWith-state">
                            <span className="chatWith-state__span">3
                                <div className="chatWith-state__bg"> </div>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="chat-wrapper">
                <div className="chat__header">
                    <div className="chat__header-img">
                        <img className="profile_img sm" src={test_img} alt="profile_img"/>
                    </div>
                    <div className="chat__header-title">
                        <span>The A Squad</span>
                    </div>
                </div>
                <ul className="chat__body">
                    <li className="chat-msg">
                        <div className="chat-msg-profile">
                            <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt="profile_img" />
                            <div className="chat-msg-date">2.45pm</div>
                        </div>
                        <div className="chat-msg-content">
                            <div className="chat-msg-text">
                                If you can keep your head when all about you. 
                                Are losing theirs and blaming it on you;
                            </div>
                            <div className="chat-msg-text">
                                If you can trust yourself when all men doubt you,
                                But make allowance for their doubting too
                            </div>
                        </div>
                    </li>
                    <li className="chat-msg owner">
                        <div className="chat-msg-profile">
                            <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="profile_img" />
                            <div className="chat-msg-date">2.50pm</div>
                        </div>
                        <div className="chat-msg-content">
                            <div className="chat-msg-text">
                                If you can wait and not be tired by waiting, 
                                Or, being lied about, don't deal in lies
                            </div>
                            <div className="chat-msg-text">
                                Or, being hated, don't give way to hating,
                                And yet don't look too good, nor talk too wise
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="chat__enter">
                    <div className="chat__enter-addFile">
                        <i className='bx bxs-image-add' ></i>
                    </div>
                    <div className="chat__enter-input">
                        <input placeholder="Type a message..."/>
                    </div>
                    <div className="chat__enter-submit">
                        <i className='bx bxs-comment-add'></i>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Tchat;

