import { authService ,firebaseInstance, fireStore, storage } from "fbase";
import { v4 as uuidv4 } from "uuid";

//login or signup with email and password
const authWithEmailAndPassword = async({newAccount, email, password, userName=""}) => {
    try {
        let data;
        if (newAccount) {
            data = await authService.createUserWithEmailAndPassword(email, password);
            const {userObj} = await ifNewbieConstructUserData(data, userName);
            await createUserObj(userObj);
            return {data : userObj, error: null};   
        } else {
            data = await authService.signInWithEmailAndPassword(email, password);
            return {data : null, error: null};   
        }
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
    const defaultProfileImg = 'https://firebasestorage.googleapis.com/v0/b/joinmates-7701.appspot.com/o/defaultProfileImg?alt=media&token=310ed0a4-3b48-41d3-9148-acfe6b028d00';
    let userName = Boolean(data.user.displayName) ? data.user.displayName : name;
    let photoURL = Boolean(data.user.photoURL) ? data.user.photoURL : defaultProfileImg;
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
            lastEditedProjectList: [],
            setting: {
                seeProjectWithIcon: false
            }
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

//get public url of uploaded project image.
const uploadProjectImg = async(projectId, imageURL) => {
    const fileRef = storage.ref().child(`projectImg/${projectId}`);
    const response = await fileRef.putString(imageURL, "data_url");
    const responseURL = await response.ref.getDownloadURL();
    return responseURL;
}

//create project and add project id in fireStore_userList_projectList
const createProject = async(userObj, projectName="project_name", projectImgDataURL="") => {
    const projectId = uuidv4();
    let projectImg;
    if(projectImgDataURL) {
        projectImg = await uploadProjectImg(projectId, projectImgDataURL);
    } else {
        projectImg = 'https://firebasestorage.googleapis.com/v0/b/joinmates-7701.appspot.com/o/defaultProjectImg.jpg?alt=media&token=f93b15f0-bd72-4b93-b031-9a5d4631cae9';
    }
    const projectObj = {
        projectInfo : {
            projectName,
            projectId,
            projectImg,
        },
        chatList : [],
        userInfo : [
            userObj.userId
        ]
    };
    await fireStore.collection('project').doc(projectId).set(projectObj);
    return projectObj.projectInfo;
}

const createChatroom = async({userObj, path = null}) => {
    console.log(userObj);
    if(!path) console.error("createChatroom Error : no path propoerty");
    const currentProjectData = (await fireStore.doc(`project/${path.projectPath.id}`).get()).data();
    let chatroomList = currentProjectData.chatList;
    if(chatroomList.includes(path.chatroomPath)) {
        alert('이미 존재하는 채널 이름입니다');
    } else {
        chatroomList.push(path.chatroomPath);
        await fireStore.doc(`project/${path.projectPath.id}`).update({
            ...currentProjectData,
            chatList : chatroomList
        });
        await createChat({path, userObj, chatType : "text", 
            chat : "Congratulations! You just create a new chatRoom"
        });
    }
    //공지사항란에 chatroom생성자와 함께 생성됨을 알려주는 기능 필요.
}

const createChat = async({path=null, userObj, chatType="text", chat="", commitTo=null}) => {
    if(!path) console.error("createChat Error : no path propoerty");
    if(!userObj.userId) console.error("createChat Error : no createrId propoerty");
    const createTime = String(Date.now());
    let chatObj = {
        createrObj: {
            createrId: userObj.userId,
            createrName: userObj.userName,
            createrProfileImg: userObj.photoURL,
            createrEmail: userObj.email
        },
        chatType,
        doc : chat,
        createTime,
        isEdited : false,
        isCommit : false
    };
    if(chatType === "text") {
        await fireStore.collection(`project/${path.projectPath.id}/${path.chatroomPath}`).doc(createTime).set(chatObj);
    } 
    //else if(chatType === img)
}

const createCommit = async({path=null, userObj, type="text", commit="", commitToId=null}) => {
    if(!path) console.error("createChat Error : no path propoerty");
    if(!commitToId) console.error("click the chat that you want to commit");
    const createTime = String(Date.now());
    let commitObj = {
        createrObj: {
            createrId: userObj.userId,
            createrName: userObj.userName,
            createrProfileImg: userObj.photoURL,
            createrEmail: userObj.email
        },
        commitType : type,
        doc : commit,
        createTime, //이걸로 정렬하니깐 이건 필수
        isEdited : false,
        isCommit : true,
        commitToId,
    };
    console.log(commitObj);
    if(type === "text") {
        await fireStore.collection(`project/${path.projectPath.id}/${path.chatroomPath}`).doc(createTime).set(commitObj);
    } //else if(chatType === img)
}

const uploadImg = async(userObj, imageURL) => {
    const fileRef = storage.ref().child(`${userObj.userId}/${uuidv4()}}`);
    const response = await fileRef.putString(imageURL, "data_url");
    const responseURL = await response.ref.getDownloadURL();
    return responseURL;
}

const uploadProfileImg = async(userObj, imageURL) => {
    const fileRef = storage.ref().child(`profileImg/${userObj.userId}`);
    const response = await fileRef.putString(imageURL, "data_url");
    const responseURL = await response.ref.getDownloadURL();
    return responseURL;
}

const updateChat = async({path = null, type='text', currentUserId, updateContents=""}) => {
    if(!path) console.error("updateChat Error : no path propoerty");
    let targetChat;
    targetChat = (await fireStore.collection(`project/${ path.projectPath.id}/${path.chatroomPath}`).doc(path.chatPath).get()).data();
    if(currentUserId === targetChat.createrObj.createrId) {
        if(type === 'text') {
            const newTargetChat = {
                ...targetChat,
                doc : updateContents,
                isEdited : true
            };
            await fireStore.doc(`project/${ path.projectPath.id}/${path.chatroomPath}/${path.chatPath}`).update(newTargetChat);
        }
    } else {
        return 'Permission denied : it is not your chat';
    }
}

const deleteChat = async({path = null, type}) => {
    if(!path) console.error("updateChat Error : no path propoerty");
    if(type === 'text') {
        await fireStore.doc(`project/${ path.projectPath.id}/${path.chatroomPath}/${path.chatPath}`).delete();
    }
}

const getUserObject = async() => {
    const userId = authService.currentUser.uid;
    return (await fireStore.collection('userList').doc(userId).get()).data();
}

const getChatList = ({path, setFunc, limit=10}) => {
    const bringChatList = fireStore.collection(`project/${ path.projectPath.id}/${path.chatroomPath}`).orderBy("createTime", "asc").limitToLast(limit)
    .onSnapshot(async function(result) {
        const chatList = await Promise.all(
            result.docs.map(async(chat) => {
                const data = chat.data();
                if(data.isCommit) {
                    const commitToObj =  (await fireStore.collection(`project/${ path.projectPath.id}/${path.chatroomPath}`).doc(data.commitToId).get()).data();
                    return {
                        ...data,
                        commitToObj
                    };
                } else {
                    return data;
                }
            })
        );
        setFunc(Array.from(chatList));
    });
    //나중에 본게임에 가서 함수 수정할 때 onLoad를 표현하자. 
    return bringChatList;
}

const onAuthStateChanged = ({setInit, setIsLoggedIn}) => {
    authService.onAuthStateChanged((user) => {
        if (user) {
        setIsLoggedIn(true);
        } else {
        setIsLoggedIn(false);
        }
        setInit(true);
    });
}

const signOut = async() => {
    await authService.signOut();
}

const getUserComfirm = async(currentPassword) => {
    let password;
    if(currentPassword) {
        password = currentPassword;
    } else {
        password = window.prompt("비밀번호를 입력해주세요");
    }
    if(password) {
        try {
            const user = authService.currentUser;
            const credential = firebaseInstance.auth.EmailAuthProvider.credential(
                user.email, 
                password
            );
            return {user, credential, error:null};
        } catch(error) {
            return {user: null, credential: null, error:"wrong password"};
        }
    } else {
        return {user: null, credential: null, error:"confirm fail: user cancel the confirm alert"};
    }
}

const deleteAccount = async() => {
    //delete user account in firebase
    const {user, credential, error} = await getUserComfirm();
    if(error) {
        alert(error);
        return;
    }
    await user.reauthenticateWithCredential(credential).then(async() => {
        await fireStore.collection('userList').doc(user.uid).delete();
        await authService.currentUser.delete().then(async()=> {
                //delete userObj
                await fireStore.collection('userList').doc(user.uid).delete();
        },()=> {
            alert(error.message);
        });
    }).catch((error) => {
        alert(error.message);
    });

}

const updatePassword = async(currentPassword, newPassword) => {
    const {user, credential, error} = await getUserComfirm(currentPassword);
    if(error) {
        alert(error);
    }
    await user.reauthenticateWithCredential(credential).then(async() => {
        const result = user.updatePassword(newPassword);
        result.then(function() {
            alert("Sucessfully change password");
        }, function(error) {
            alert(error.message);
        });
    }).catch((error) => {
        alert(error.message);
    });
}

const updateEmail = async(newEmail, currentPassword) => {
    const {user, credential, error} = await getUserComfirm(currentPassword);
    if(error) {
        alert(error);
    }
    await user.reauthenticateWithCredential(credential).then(async() => {
        const result = user.updateEmail(newEmail);
        result.then(async()=> {
            alert("Sucessfully change email");
        }, function(error) {
            alert(error.message);
        });
    }).catch((error) => {
        alert(error.message);
    });
}

const updateUserName = async(userName) => {
    await authService.currentUser.updateProfile({displayName:userName}).then(
        async()=> {
            alert("Sucessfully change user name");
        },
        function(error) {
            alert(error.message);
        }
    );
}

const updateUserProfileImg = async(userObj, profileImg) => {
    const responseURL = await uploadProfileImg(userObj, profileImg);
    await authService.currentUser.updateProfile({photoURL:responseURL}).then(
        async()=> {
            alert("Sucessfully change profile image");
        },
        function(error) {
            alert(error.message);
        }
    );
    return responseURL;
}

const updateUserObj = async(userObj) => {
    await fireStore.collection('userList').doc(userObj.userId).update(userObj);
}

const getProjectInfo = async(projectId, setFunc) => {
    let projectInfo = null;
    const bringProjectObj = fireStore.collection('project').doc(projectId).onSnapshot(async function(result) {
        const projectData = result.data();
        const userIdList = projectData.userInfo;
        const userObjList = await Promise.all(
            userIdList.map(async(userId) => {
                const userInfo = (await fireStore.collection('userList').doc(userId).get()).data();
                return {
                    name: userInfo.userName,
                    userId: userInfo.userId,
                    profileImg: userInfo.photoURL
                };
            })
        );
        projectInfo = {
            ...projectData,
            userObjList
        };
        setFunc(projectInfo);
    });
    // return new Promise(resolve => {
    //     const waitForValue = setInterval(()=> {
    //         if(projectInfo) {
    //             clearInterval(waitForValue);
    //             setFunc(projectInfo);
    //             resolve(bringProjectObj);
    //         } else {
    //             console.log("waiting...");
    //         };
    //     },100);
    // });
    return bringProjectObj;
}

//chatroom과 project를 추가할 때 특수문자는 안된다고 alert 넣기.
export {authWithEmailAndPassword, 
    socialAccount, 
    createProject, 
    createChatroom, 
    createChat,
    createCommit,
    updateChat,
    deleteChat,
    getUserObject,
    getChatList,
    onAuthStateChanged,
    signOut,
    deleteAccount,
    updatePassword,
    updateEmail,
    updateUserName,
    updateUserProfileImg,
    uploadImg,
    updateUserObj,
    getProjectInfo
};

//나중에 useState를 이용하여 사용자가 이동하는 경로를 추적하는 오브젝트를 하나 생성해서 해당 오브젝트를 인자로 넘기자 지금 인자가 너무 많다.
//해당 오브젝트에는 현재 위치, 유저가 클릭한 이벤트에 대한 글의 name(또는 id), type, 유저 정보(id, name, 등등)이 있어야 한다. 