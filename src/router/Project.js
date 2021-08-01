import { getProjectInfo } from 'components/fComponents';
import ProjectNavigation from 'components/ProjectNavigation';
import React, { useEffect, useState } from 'react';

const Project = ({userObj, projectPath, chatroomPath, setChatroomPath}) => {
    const [ready, setReady] = useState(false);
    const [projectObj, setProjectObj] = useState(null);

    useEffect(()=> {
        const getProjectObj = async() => {
            await getProjectInfo(projectPath.id).then((projectInfo)=> {
                setProjectObj(projectInfo);
                setReady(true);
            },(error)=> {
                console.error(error);
            });
        }
        getProjectObj();
    },[projectPath]);

    return (
        <div className="project-container">
            {ready ?(
            <React.Fragment>
                <ProjectNavigation userObj={userObj} projectObj={projectObj}/>
                <div className="chat-wrapper">
                    <div className="chat__header">
                        <div className="chat__header-title">
                            <span>#the A Squad</span>
                        </div>
                        <div className='chat__header-additional'>
                            <div className="chat__header-search">
                                <i className='bx bx-search' ></i>
                                <input type='text' placeholder='Search'/>
                            </div>
                            <div className='chat__header-more'>
                                <i className='bx bx-dots-vertical-rounded'></i>
                            </div>
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
                        <div className="chat__enter-option main-option chat__enter-addFile">
                            <i className='bx bxs-image-add' ></i>
                        </div>
                        <div className="chat__enter-input">
                            <input placeholder="Type a message..."/>
                        </div>
                        <div className="chat__enter-option sub-option chat__enter-submit">
                            <i className='bx bxs-message-alt-add' ></i>
                        </div>
                    </div>
                </div>
            </React.Fragment>
            ):(
                <div>Loading...</div>
            )}
        </div>
    )
}

export default Project;