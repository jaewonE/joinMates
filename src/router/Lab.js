import React, { useRef, useEffect, useState } from 'react';
import {getChatList, getUserObject, createChat, createCommit} from 'components/fComponents';

//1. 로드를 모두 완료하였을 경우 스크롤이 가장 상단에 도착해도 새로고침 되지 않도록 한다.
//2. 

const Lab = () => {
    const [userObj, setUserobj] = useState("");
    const [chatList, setChatList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [commitValue, setCommitValue] = useState("");
    const [isChatReset, setIsChatReset] = useState(false);
    const didMountRef = useRef(false);
    const bringChatMount = useRef(false);
    var chatSettingObj = {
            limit : 10,
            times : 0,
            stopFunc : null
    };


    const getUserObj = async() => {
        const userObject = await getUserObject();
        setUserobj(userObject);
    };
    const bringChat = () => {
        if(bringChatMount.current) {
            setIsChatReset(true);
            chatSettingObj.stopFunc();
            console.log("2. clear event");
        } else {
            bringChatMount.current = true;
        }

        const bringChatList = getChatList({
            path: ['ae2d8088-e527-41da-9588-bcde4188b5be','chatroom1'],
            limit : chatSettingObj.limit*(chatSettingObj.times+1),
            func : setChatList
        });
        chatSettingObj = {
            limit : chatSettingObj.limit,
            times : chatSettingObj.times + 1,
            stopFunc : bringChatList
        };
    }
    const onChange = (e) => {
        const {target: {value}} = e;
        setInputValue(value);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        createChat({
            path: ['ae2d8088-e527-41da-9588-bcde4188b5be','chatroom1'],
            createrId : userObj.userId,
            chat: inputValue
        });
    }
    const onChangeCommit = (e) => {
        const {target: {value}} = e;
        setCommitValue(value);
    }
    const onSubmitCommit = (e) => {
        e.preventDefault();
        createCommit({
            path: ['ae2d8088-e527-41da-9588-bcde4188b5be','chatroom1'],
            createrId : userObj.userId,
            commit : commitValue,
            commitToId : '1627214543690' //text2
        });
    }
    const settingScroll = () => {

        if(isChatReset) {
            setIsChatReset(false);
        } else {
            const wrapper = document.querySelector('.wrapper');
            wrapper.scrollTop = wrapper.scrollHeight;
        }
    }
    const handleScrollEvent = (type) => {
        const wrapper = document.querySelector('.wrapper');
        if(type === "add") {
            wrapper.addEventListener('scroll', (e) => {
                if(e.target.scrollTop === 0) {
                    console.log("1. at the top");
                    bringChat();
                }
            });
        } else if(type === "remove") {
            wrapper.removeEventListener('scroll', (e) => {
                if(e.target.scrollTop === 0) {
                    console.log("1. at the top");
                    bringChat();
                }
            });
        }
    }
    useEffect(()=> {
        if (didMountRef.current) { 
            settingScroll(); //component가 mount되고 난 다음에 scroll을 설정해주어야 한다.
        } else {
            getUserObj();
            bringChat();
            handleScrollEvent("add");
            didMountRef.current = true;
        }
        return () => {
            handleScrollEvent("remove");
        }
    },[chatList]);
    return (
        <div className="lab">
            <form onSubmit={onSubmit}>
                <h1>chat</h1>
                <input type="text" name="chatBox" placeholder="enter text" onChange={onChange}/>
                <input type="submit" value="Click"/>
            </form>
            <form onSubmit={onSubmitCommit}>
                <h1>commit</h1>
                <input type="text" name = "commitBox" placeholder="enter text" onChange={onChangeCommit}/>
                <input type="submit" value="Click"/>
            </form>
            <div className="wrapper">
                {chatList.map(chat => (
                    <h3 key={chat.createTime}>{chat.isCommit ? "commit :" : "chat :"} 
                    {chat.doc && chat.doc} 
                     : {chat.isCommit && chat.commitToObj.doc}
                    </h3>
                ))}
            </div>
        </div>
    )
}

export default Lab;

/*
1. user_list에서 해당 유저의 정보를 가져온다.(회원가입을 한 경우 user_list에 회원 정보를 새로 생성한다.); 객체로 useState를 이용하여 저장.
2. userName과 profile_img, project_list 를 이용하여 가장 왼쪽 sidebar를 완성한다.
3. last_edited_project_id를 가져와서 해당프로젝트를 찾아가서 해당 프로젝트의 projcet_info의 userInfo에 접근하여 해당 유저의 id가 프로젝트에 존재하면 진행
4. project_info의 user_info의 본인 정보에서 last_edited 정보를 가져와 마지막으로 수정한 채팅룸 정보를 가져온다.
5. 해당 프로젝트의 project_info의 chat_list의 정보를 가져와 왼쪽에서 두번째 줄을 render한다. 
6. 유저가 마지막으로 수정한 채팅룸에 대해서 컬렉션에서 검색하여 찾아 최근 10개의 채팅만 가져온다.


*/