import React, { useEffect, useState } from 'react';
import { fireStore } from 'fbase';

const Lab = ({userObj}) => {
    const [currentProjectId, setCurrentProjectId] = useState("");
    const [currentChatroomName, setCurrentChatroomName] = useState("");

    //find user infomation in user_list by user id
    const findUserInfo = async(user_id) => {
        const user_list = await fireStore.collection("user_list").get();
    }


  


    const func = async() => {
        const result = (await fireStore.collection("project").doc('random_id').collection('a1').doc('doc1').get());
        console.log(result.data());
        console.log("---------");
        const result2 = (await fireStore.collection('nweets/random_id/a1').doc('doc1').get());
        console.log(result2.data());
    }
    useEffect(()=> {
        console.log("user object");
        console.log(userObj);
    },[]);
    return (
        <h1>Lab</h1>
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