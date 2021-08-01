import React, { useState } from 'react';
import { Link } from "react-router-dom";

const ProjectNavigation = ({userObj, projectObj}) => {
    const [isAddmembers, setIsAddmembers] = useState(false);
    const [isAddChannels, setIsAddChannels] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [newChannelName, setNewChannelName] = useState("");
    const onClick = (e) => {
        const {target: {id}} = e;
        if(id === 'chatList__title-members-add') {
            setIsAddmembers(prev=>!prev);
        } else if(id === 'chatList__title-channels-add'){
            setIsAddChannels(prev=>!prev);
        };
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const {target: {name}} = e;
        if(name === 'add-members') {
            console.log(name);
            console.log(newMemberName);
        } else if(name === 'add-channels'){
            console.log(name);
            console.log(newChannelName);
        }
    }
    const onChange = (e) => {
        const {id, value} = e.target;
        if(id ==='chatList__add-members') {
            setNewMemberName(value);
        } else if(id === 'chatList__add-channels') {
            setNewChannelName(value);
        };
    }
    return (
        <div className="chatList-wrapper">
            <div className="chatList-userInfo">
                <div className="chatList-userInfo__img-wrapper">
                    <img className='profile_img lg2' src={userObj.photoURL} alt="img"/>
                </div>
                <div className="chatList-userInfo__info">
                    <div className='chatList-userInfo__info-name'>{userObj.userName}</div>
                    <div className='chatList-userInfo__info-email'>{userObj.email}</div>
                </div>
            </div>
            <div className='chatList-components chatList-members'>
                <div className='chatList__title'>
                    <i className='bx bxs-down-arrow'></i>
                    <div className='chatList__title-title'>Members</div>
                    {isAddmembers?(
                        <i id='chatList__title-members-add' onClick={onClick} className='bx bx-arrow-back'></i>
                    ):(
                        <i id='chatList__title-members-add' onClick={onClick} className='bx bxs-user-plus' ></i>
                    )}
                </div>
                {isAddmembers?(
                    <form onSubmit={onSubmit} name='add-members' className='chatList__add'>
                        <span>Enter member's email</span>
                        <input type='text' placeholder="Enter member's email" id='chatList__add-members' onChange={onChange} value={newMemberName}/>
                        <input type='submit' value='Add member'/>
                    </form>
                ):(
                    <ul className=' chatList__list-wrapper'>
                        {projectObj.userObjList.map(member => (
                            <li key={member.userId} className="chatList__list">
                                <img src={member.profileImg} alt='img' />
                                <span className="chatList__list-title">{member.name}</span>
                            </li>
                        ))}
                    </ul> 
                )}
            </div>
            <div className='chatList-components chatList-channels'>
                <div className='chatList__title'>
                    <i className='bx bxs-down-arrow'></i>
                    <div className=' chatList__title-title'>Channels</div>
                    {isAddChannels?(
                        <i id='chatList__title-channels-add' onClick={onClick} className='bx bx-arrow-back'></i>
                    ):(
                        <i id='chatList__title-channels-add' onClick={onClick} className='bx bxs-plus-square'></i> 
                    )}
                </div>
                {isAddChannels?(
                    <form onSubmit={onSubmit} name='add-channels' className='chatList__add'>
                        <span>Create New channel</span>
                        <input type='text' placeholder="Enter channel name" id='chatList__add-channels' onChange={onChange} value={newChannelName}/>
                        <input type='submit' value='create channel'/>
                    </form>
                ):(
                    <ul className='chatList__list-wrapper'>
                        {projectObj.chatList.map(chatroom => (
                            <li key={chatroom} className="chatList__list">
                                <Link className="chatList__list-link" 
                                        name={chatroom}
                                        key={chatroom} 
                                        to={{
                                        pathname: "/project", 
                                        hash: `#${projectObj.projectInfo.projectName}#${chatroom}`,
                                        state: { fromDashboard: true }
                                        }}
                                >
                                    <span className='chatList__list-hash'>#</span>
                                    <span className="chatList__list-title">{chatroom}</span>
                                </Link>
                            </li>
                        ))}
                    </ul> 
                )}
            </div>
        </div>
    );
}

export default ProjectNavigation;