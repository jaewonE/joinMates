import { authService ,firebaseInstance, fireStore } from "fbase";
import { v4 as uuidv4 } from "uuid";

//login or signup with email and password
const authWithEmailAndPassword = async({newAccount, email, password, userName=""}) => {
    try {
        let data;
        if (newAccount) {
          data = await authService.createUserWithEmailAndPassword(email, password);
        } else {
            data = await authService.signInWithEmailAndPassword(email, password);
        }
        const {userObj} = await ifNewbieConstructUserData(data, userName);
        if(newAccount) await createUserObj(userObj);
        return {data : userObj, error: null};   
    } catch (error) {
        return {data : null, error: error.message};
    }
};

//login or signup with google and github
const socialAccount = async(name) => {
    try {
        let provider;
        let data;
        if(name === "github") {
          provider = new firebaseInstance.auth.GithubAuthProvider();
        } else if(name === "google") {
          provider = new firebaseInstance.auth.GoogleAuthProvider();
        }
        data = await firebaseInstance.auth().signInWithPopup(provider);
        const {isNewAccount, userObj} = await ifNewbieConstructUserData(data);
        if(isNewAccount) await createUserObj(userObj);
        return {data : userObj, error: null};
    } catch (error){
        return {data : null, error: error.message};
    }
};

//create user infomation object from auth data
const ifNewbieConstructUserData = async(data, name="set_your_name") => {
    let userName = Boolean(data.user.displayName) ? data.user.displayName : name;
    let photoURL = Boolean(data.user.photoURL) ? data.user.photoURL : "";
    // let photoURL = ""
    // if(data.user.photoURL) {
    //     const fileRef = storage.ref().child(`${data.user.uid}/${uuidv4()}}`);
    //     const response = await fileRef.putString(data.user.photoURL, String);
    //     const responseURL = await response.ref.getDownloadURL();
    //     console.log(data.user.photoURL);
    //     console.log(responseURL);
    //     photoURL = responseURL;
    // };
    let isNewAccount = data.additionalUserInfo.isNewUser;
    if(isNewAccount) {
        const userObj = {
            userName, 
            userId : data.user.uid,
            email : data.user.email,
            emailVerified : data.user.emailVerified,
            photoURL,
            friends : [],
            projectList : [],
            lastEditedProjectId : "",
            lastEditedChatroomName : ""
        }
        return {isNewAccount, userObj};
    } else {
        return null;
    }
}

//set user infomation object on fireStore_userList
const createUserObj = async(userObj) => {
    await fireStore.collection('userList').doc(userObj.userId).set(userObj);
}

//create project and add project id in fireStore_userList_projectList
const createProject = async({createrId, projectName="project_name", projectImg=""}) => {
    const createrInfo = (await fireStore.doc(`userList/${createrId}`).get()).data();
    // const createrInfo = (await fireStore.collection('userList').doc(createrId).get()).data();
    const projectId = uuidv4();
    const projectObj = {
        projectInfo : {
            projectName,
            projectId,
            projectImg,
        },
        chatList : [],
        useInfo : [{
            userId : createrInfo.userId,
            userName : createrInfo.userName,
            photoURL : createrInfo.photoURL
        }]
    };
    const originProjectList = createrInfo.projectList;
    const projectList = [
        ...originProjectList,
        projectObj.projectInfo
    ];
    await fireStore.collection('project').doc(projectId).set(projectObj);
    await fireStore.collection('userList').doc(createrId).update({
        ...createrInfo,
        projectList
    });
}

//chatroomName을 활용해야 한다. 아직 구현 X
const createChatroom = async(chatroomName, path = null) => {
    if(!path) console.error("createChatroom Error : no path propoerty");
    await createChat({path, chatType : "text", 
        chat : "Congratulations! You just create a new chatRoom"
    });
    //projectInfo에 chat_list에 추가해야 함.
    //공지사항란에 chatroom생성자와 함께 생성됨을 알려주는 기능 필요.
}

const createChat = async({path=null, createrId, chatType="text", chat="", commitTo=null}) => {
    if(!path) console.error("createChat Error : no path propoerty");
    //path[0] = projectId
    //path[1] = chatroomName
    const createTime = String(Date.now());
    let chatObj = {
        createrId,
        chatType,
        doc : chat,
        createTime,
        isEdited : false,
        isCommit : false
    };
    console.log(chatObj);
    if(chatType === "text") {
        await fireStore.collection(`project/${path[0]}/${path[1]}`).doc(createTime).set(chatObj);
    } 
    //else if(chatType === img)
}

const createCommit = async({path=null, createrId, type="text", commit="", commitToId=null}) => {
    if(!path) console.error("createChat Error : no path propoerty");
    if(!commitToId) console.error("click the chat that you want to commit");
    //path[0] = projectId
    //path[1] = chatroomName
    const createTime = String(Date.now());
    let commitObj = {
        createrId,
        commitType : type,
        doc : commit,
        createTime, //이걸로 정렬하니깐 이건 필수
        isEdited : false,
        isCommit : true,
        commitToId,
    };
    console.log(commitObj);
    if(type === "text") {
        await fireStore.collection(`project/${path[0]}/${path[1]}`).doc(createTime).set(commitObj);
    } //else if(chatType === img)
}

const updateChat = async({path = null, type='text', currentUserId, updateContents=""}) => {
    if(!path) console.error("updateChat Error : no path propoerty");
    let targetChat;
    targetChat = (await fireStore.collection(`project/${path[0]}/${path[1]}`).doc(path[2]).get()).data();
    if(currentUserId === targetChat.createrId) {
        if(type === 'text') {
            const newTargetChat = {
                ...targetChat,
                doc : updateContents,
                isEdited : true
            };
            await fireStore.doc(`project/${path[0]}/${path[1]}/${path[2]}`).update(newTargetChat);
        }
    } else {
        return 'Permission denied : it is not your chat';
    }
}

const deleteChat = async({path = null, type}) => {
    if(!path) console.error("updateChat Error : no path propoerty");
    if(type === 'text') {
        await fireStore.doc(`project/${path[0]}/${path[1]}/${path[2]}`).delete();
    }
}

const getUserObject = async() => {
    const userId = authService.currentUser.uid;
    return (await fireStore.collection('userList').doc(userId).get()).data();
}

const getChatList = ({path, limit=10, func}) => {
    const bringChatList = fireStore.collection(`project/${path[0]}/${path[1]}`).orderBy("createTime", "asc").limitToLast(limit)
    .onSnapshot(async function(result) {
        const chatList = await Promise.all(
            result.docs.map(async(chat) => {
                const data = chat.data();
                if(data.isCommit) {
                    const commitToObj =  (await fireStore.collection(`project/${path[0]}/${path[1]}`).doc(data.commitToId).get()).data();
                    return {
                        ...data,
                        commitToObj
                    };
                } else {
                    return data;
                }
            })
        );
        func(Array.from(chatList));
    });
    //나중에 본게임에 가서 함수 수정할 때 useState나 다른 방법 있으면 그걸로 하고 해서 onLoad를 표현하자. 
    return bringChatList;
}

export {authWithEmailAndPassword, 
    socialAccount, 
    createProject, 
    createChatroom, 
    createChat,
    createCommit,
    updateChat,
    deleteChat,
    getUserObject,
    getChatList
};

//나중에 useState를 이용하여 사용자가 이동하는 경로를 추적하는 오브젝트를 하나 생성해서 해당 오브젝트를 인자로 넘기자 지금 인자가 너무 많다.
//해당 오브젝트에는 현재 위치, 유저가 클릭한 이벤트에 대한 글의 name(또는 id), type, 유저 정보(id, name, 등등)이 있어야 한다. 