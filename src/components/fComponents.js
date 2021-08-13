import { authService, firebaseInstance, fireStore, storage } from 'fbase';
import { v4 as uuidv4 } from 'uuid';

//login or signup with email and password
const authWithEmailAndPassword = async ({
  newAccount,
  email,
  password,
  userName = '',
}) => {
  try {
    let data;
    if (newAccount) {
      data = await authService.createUserWithEmailAndPassword(email, password);
      const { userObj } = await ifNewbieConstructUserData(data, userName);
      await createUserObj(userObj);
      return { data: userObj, error: null };
    } else {
      data = await authService.signInWithEmailAndPassword(email, password);
      return { data: null, error: null };
    }
  } catch (error) {
    const code = error.code;
    if (code === 'auth/invalid-email') {
      return { data: null, error: '존재하지 않는 이메일입니다' };
    } else if (code === 'auth/user-disabled') {
      return { data: null, error: '존재하지 않거나 잘못된 이메일입니다' };
    } else if (code === 'auth/user-not-found') {
      return { data: null, error: '존재하지 않는 유저입니다' };
    } else if (code === 'auth/wrong-password') {
      return { data: null, error: '잘못된 비밀번호 입니다' };
    } else {
      return { data: null, error: error.message };
    }
  }
};

//login or signup with google and github
const socialAccount = async (name) => {
  try {
    let provider;
    let data;
    if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    } else if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }
    data = await firebaseInstance.auth().signInWithPopup(provider);
    const { isNewAccount, userObj } = await ifNewbieConstructUserData(data);
    if (isNewAccount) await createUserObj(userObj);
    return { data: userObj, error: null };
  } catch (error) {
    const code = error.code;
    if (code === 'auth/account-exists-with-different-credential') {
      return { data: null, error: '이미 존재하는 이메일입니다' };
    } else if (code === 'auth/auth-domain-config-required') {
      return { data: null, error: '허용되지 않는 도메인 주소입니다' };
    } else if (code === 'cancelled-popup-request') {
      return {
        data: null,
        error: '한번에 너무 많은 팝업이 발생하였습니다\n다시 시도해주십시오',
      };
    } else if (code === 'auth/operation-not-allowed') {
      return { data: null, error: '해당 소셜에 맞는 이메일을 사용해주십시오' };
    } else if (code === 'auth/operation-not-supported-in-this-environment') {
      return {
        data: null,
        error: 'http 또는 https를 제외한 프로트콜은 지원되지 않습니다',
      };
    } else if (code === 'auth/popup-blocked') {
      return { data: null, error: '팝업을 허용해 주십시오' };
    } else if (code === 'auth/popup-closed-by-user') {
      return { data: null, error: '' }; //pass
    } else if (code === 'auth/unauthorized-domain') {
      console.error(error.message);
      return { data: null, error: '' };
    } else {
      return { data: null, error: error.message };
    }
  }
};

//create user infomation object from auth data
const ifNewbieConstructUserData = async (data, name = 'set_your_name') => {
  const defaultProfileImg =
    'https://firebasestorage.googleapis.com/v0/b/joinmates-7701.appspot.com/o/defaultProfileImg?alt=media&token=310ed0a4-3b48-41d3-9148-acfe6b028d00';
  let userName = Boolean(data.user.displayName) ? data.user.displayName : name;
  let photoURL = Boolean(data.user.photoURL)
    ? data.user.photoURL
    : defaultProfileImg;
  let isNewAccount = data.additionalUserInfo.isNewUser;
  if (isNewAccount) {
    const userObj = {
      userName,
      userId: data.user.uid,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      photoURL,
      friends: [],
      projectList: [],
      lastEditedProjectList: [],
      requestMessages: [],
      setting: {
        seeProjectWithIcon: false,
      },
    };
    return { isNewAccount, userObj };
  } else {
    return null;
  }
};

//set user infomation object on fireStore_userList
const createUserObj = async (userObj) => {
  await fireStore.collection('userList').doc(userObj.userId).set(userObj);
};

//get public url of uploaded project image.
const uploadProjectImg = async (projectId, imageURL) => {
  try {
    const fileRef = storage.ref().child(`projectImg/${projectId}`);
    const response = await fileRef.putString(imageURL, 'data_url');
    const responseURL = await response.ref.getDownloadURL();
    return responseURL;
  } catch (error) {
    return null;
  }
};

//create project and add project id in fireStore_userList_projectList
const createProject = async ({
  userObj,
  projectName = 'project_name',
  projectImgDataURL = '',
  memberIdList = [],
  description = '',
}) => {
  const projectId = uuidv4();
  let projectImg;
  if (projectImgDataURL) {
    projectImg = await uploadProjectImg(projectId, projectImgDataURL);
  } else {
    projectImg =
      'https://firebasestorage.googleapis.com/v0/b/joinmates-7701.appspot.com/o/defaultProjectImg.jpg?alt=media&token=f93b15f0-bd72-4b93-b031-9a5d4631cae9';
  }
  const projectObj = {
    projectInfo: {
      projectName,
      projectId,
      projectImg,
    },
    chatList: [],
    userInfo: memberIdList,
    leaderId: userObj.userId,
    description,
    createTime: String(Date.now()),
    requestUserList: [],
    lastChatId: 'ch0',
  };
  await fireStore.collection('project').doc(projectId).set(projectObj);
  return projectObj.projectInfo;
};

const createChatroom = async ({ userObj, path = null }) => {
  if (!path) console.error('createChatroom Error : no path propoerty');
  const currentProjectData = (
    await fireStore.doc(`project/${path.projectPath.id}`).get()
  ).data();
  let chatroomList = currentProjectData.chatList;
  let isOverlap = false;
  for (let i = 0; i < Array.from(chatroomList).length; i++) {
    if (chatroomList[i].name === path.chatroomPath.name) {
      alert('이미 존재하는 채널 이름입니다');
      isOverlap = true;
      return;
    }
  }
  if (!isOverlap) {
    const preLastChatId = currentProjectData.lastChatId;
    const chatIndex = Number(String(preLastChatId).slice(2)) + 1;
    const lastChatId = `ch${chatIndex}`;
    const newChatroomObj = { id: lastChatId, name: path.chatroomPath.name };
    chatroomList = [...chatroomList, newChatroomObj];
    await fireStore.doc(`project/${path.projectPath.id}`).update({
      ...currentProjectData,
      chatList: chatroomList,
      lastChatId,
    });
    const newPath = {
      projectPath: path.projectPath,
      chatroomPath: newChatroomObj,
    };
    await createChat({
      path: newPath,
      userObj,
      chatType: 'text',
      chat: 'Congratulations! You just create a new chatRoom',
    });
    return `ch${chatIndex}`;
  } else {
    return;
  }
  //공지사항란에 chatroom생성자와 함께 생성됨을 알려주는 기능 필요.
};

const createChat = async ({
  path = null,
  userObj,
  chatType = 'text',
  chat = '',
  commitTo = null,
}) => {
  if (!path) console.error('createChat Error : no path propoerty');
  if (!userObj.userId)
    console.error('createChat Error : no createrId propoerty');
  let createTime = String(Date.now());
  if (chatType === 'img') {
    chat = await getStorageURLOfChatImg(path, chat, createTime);
  }
  let chatObj = {
    createrObj: {
      createrId: userObj.userId,
      createrName: userObj.userName,
      createrProfileImg: userObj.photoURL,
      createrEmail: userObj.email,
    },
    chatType,
    doc: chat,
    createTime,
    isEdited: false,
    isCommit: false,
  };
  await fireStore
    .collection(`project/${path.projectPath.id}/${path.chatroomPath.id}`)
    .doc(createTime)
    .set(chatObj);
};

const createCommit = async ({
  path = null,
  userObj,
  type = 'text',
  commit = '',
  commitToId = null,
}) => {
  if (!path) console.error('createChat Error : no path propoerty');
  if (!commitToId) console.error('click the chat that you want to commit');
  const createTime = String(Date.now());
  let commitObj = {
    createrObj: {
      createrId: userObj.userId,
      createrName: userObj.userName,
      createrProfileImg: userObj.photoURL,
      createrEmail: userObj.email,
    },
    commitType: type,
    doc: commit,
    createTime,
    isEdited: false,
    isCommit: true,
    commitToId,
  };
  console.log(commitObj);
  if (type === 'text') {
    await fireStore
      .collection(`project/${path.projectPath.id}/${path.chatroomPath.id}`)
      .doc(createTime)
      .set(commitObj);
  } //else if(chatType === img)
};

// const uploadImg = async (userObj, imageURL) => {
//   const fileRef = storage.ref().child(`${userObj.userId}/${uuidv4()}}`);
//   const response = await fileRef.putString(imageURL, 'data_url');
//   const responseURL = await response.ref.getDownloadURL();
//   return responseURL;
// };

const getStorageURLOfChatImg = async (path, imageURL, createTime) => {
  const fileRef = storage
    .ref()
    .child(
      `projectImg/${path.projectPath.id}/${path.chatroomPath.id}/${createTime}`
    );
  const response = await fileRef.putString(imageURL, 'data_url');
  const responseURL = await response.ref.getDownloadURL();
  return responseURL;
};

const uploadProfileImg = async (userObj, imageURL) => {
  const fileRef = storage.ref().child(`profileImg/${userObj.userId}`);
  const response = await fileRef.putString(imageURL, 'data_url');
  const responseURL = await response.ref.getDownloadURL();
  return responseURL;
};

const updateChat = async ({
  path = null,
  type = 'text',
  currentUserId,
  updateContents = '',
}) => {
  if (!path) console.error('updateChat Error : no path propoerty');
  let targetChat;
  targetChat = (
    await fireStore
      .collection(`project/${path.projectPath.id}/${path.chatroomPath.id}`)
      .doc(path.chatPath)
      .get()
  ).data();
  if (currentUserId === targetChat.createrObj.createrId) {
    if (type === 'text') {
      const newTargetChat = {
        ...targetChat,
        doc: updateContents,
        isEdited: true,
      };
      await fireStore
        .doc(
          `project/${path.projectPath.id}/${path.chatroomPath.id}/${path.chatPath}`
        )
        .update(newTargetChat);
    }
  } else {
    return 'Permission denied : it is not your chat';
  }
};

const deleteChat = async ({ path = null, type }) => {
  if (!path) console.error('updateChat Error : no path propoerty');
  if (type === 'text') {
    await fireStore
      .doc(
        `project/${path.projectPath.id}/${path.chatroomPath.id}/${path.chatPath}`
      )
      .delete();
  }
};

const getUserObject = async () => {
  const userId = authService.currentUser.uid;
  const userObj = (
    await fireStore.collection('userList').doc(userId).get()
  ).data();
  const projectIdList = Array.from(userObj.projectList).map((project) => {
    return project.projectId;
  });
  const projectListRef = await Promise.all(
    projectIdList.map(async (projectId) => {
      const projectObj = (
        await fireStore.doc(`project/${projectId}`).get()
      ).data();
      const userList = Array.from(projectObj.userInfo);
      if (userList.indexOf(userId) + 1) {
        let chatroomPath = '';
        if (Array.from(projectObj.chatList).length) {
          chatroomPath = projectObj.chatList[0];
        }
        return {
          projectInfo: projectObj.projectInfo,
          lastEditedProject: {
            chatroomPath,
            projectPath: {
              id: projectObj.projectInfo.projectId,
              name: projectObj.projectInfo.projectName,
            },
          },
          reject: false,
        };
      } else {
        //project doesn't have userId: user has except from project by leader.
        return {
          projectInfo: projectObj.projectInfo.projectName,
          lastEditedProject: null,
          reject: true,
        };
      }
    })
  );
  let projectList = [];
  let rejectList = [];
  let lastEditedProjectList = [];
  for (let i = 0; i < projectListRef.length; i++) {
    if (projectListRef[i].reject) {
      rejectList = [...rejectList, projectListRef[i].projectInfo];
    } else {
      projectList = [...projectList, projectListRef[i].projectInfo];
      lastEditedProjectList = [
        ...lastEditedProjectList,
        projectListRef[i].lastEditedProject,
      ];
    }
  }
  return {
    reject: rejectList,
    user: { ...userObj, lastEditedProjectList, projectList },
  };
};

const getChatList = ({ path, setFunc, limit = 10 }) => {
  const bringChatList = fireStore
    .collection(`project/${path.projectPath.id}/${path.chatroomPath.id}`)
    .orderBy('createTime', 'asc')
    .limitToLast(limit)
    .onSnapshot(async function (result) {
      const chatList = await Promise.all(
        result.docs.map(async (chat) => {
          const data = chat.data();
          if (data.isCommit) {
            const commitToObj = (
              await fireStore
                .collection(
                  `project/${path.projectPath.id}/${path.chatroomPath.id}`
                )
                .doc(data.commitToId)
                .get()
            ).data();
            return {
              ...data,
              commitToObj,
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
};

const onAuthStateChanged = ({ setInit, setIsLoggedIn }) => {
  authService.onAuthStateChanged((user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setInit(true);
  });
};

const signOut = async () => {
  await authService.signOut();
};

const getUserComfirm = async (currentPassword) => {
  let password;
  if (currentPassword) {
    password = currentPassword;
  } else {
    password = window.prompt('비밀번호를 입력해주세요');
  }
  if (password) {
    try {
      const user = authService.currentUser;
      const credential = firebaseInstance.auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      return { user, credential, error: null };
    } catch (error) {
      return { user: null, credential: null, error: 'wrong password' };
    }
  } else {
    return {
      user: null,
      credential: null,
      error: 'confirm fail: user cancel the confirm alert',
    };
  }
};

const deleteAccount = async () => {
  //delete user account in firebase
  const { user, credential, error } = await getUserComfirm();
  if (error) {
    alert(error);
    return;
  }
  await user
    .reauthenticateWithCredential(credential)
    .then(async () => {
      await fireStore.collection('userList').doc(user.uid).delete();
      await authService.currentUser.delete().then(
        async () => {
          //delete userObj
          await fireStore.collection('userList').doc(user.uid).delete();
        },
        () => {
          alert(error.message);
        }
      );
    })
    .catch((error) => {
      alert(error.message);
    });
};

const updatePassword = async (currentPassword, newPassword) => {
  const { user, credential, error } = await getUserComfirm(currentPassword);
  if (error) {
    alert(error);
  }
  await user
    .reauthenticateWithCredential(credential)
    .then(async () => {
      const result = user.updatePassword(newPassword);
      result.then(
        function () {
          alert('Sucessfully change password');
        },
        function (error) {
          alert(error.message);
        }
      );
    })
    .catch((error) => {
      alert(error.message);
    });
};

const updateEmail = async (newEmail, currentPassword) => {
  const { user, credential, error } = await getUserComfirm(currentPassword);
  if (error) {
    alert(error);
  }
  await user
    .reauthenticateWithCredential(credential)
    .then(async () => {
      const result = user.updateEmail(newEmail);
      result.then(
        async () => {
          alert('Sucessfully change email');
        },
        function (error) {
          alert(error.message);
        }
      );
    })
    .catch((error) => {
      alert(error.message);
    });
};

const updateUserName = async (userName) => {
  await authService.currentUser.updateProfile({ displayName: userName }).then(
    async () => {
      alert('Sucessfully change user name');
    },
    function (error) {
      alert(error.message);
    }
  );
};

const updateUserProfileImg = async (userObj, profileImg) => {
  const responseURL = await uploadProfileImg(userObj, profileImg);
  await authService.currentUser.updateProfile({ photoURL: responseURL }).then(
    async () => {
      alert('Sucessfully change profile image');
    },
    function (error) {
      alert(error.message);
    }
  );
  return responseURL;
};

const updateProjectImg = async (projectId, projectImg) => {
  const projectObj = (await fireStore.doc(`project/${projectId}`).get()).data();
  let projectInfo = projectObj.projectInfo;
  const responseURL = await uploadProjectImg(projectId, projectImg);
  if (responseURL) {
    projectInfo.projectImg = responseURL;
    await fireStore.doc(`project/${projectId}`).update({
      ...projectObj,
      projectInfo,
    });
    alert('Sucessfully change project image');
    return responseURL;
  } else {
    alert("Error: can't upload project image");
  }
};

const updateProjectName = async (projectId, projectName) => {
  const projectObj = (await fireStore.doc(`project/${projectId}`).get()).data();
  let projectInfo = projectObj.projectInfo;
  projectInfo.projectName = projectName;
  await fireStore.doc(`project/${projectId}`).update({
    ...projectObj,
    projectInfo,
  });
  alert('Sucessfully change project name');
};

const updateProjectDescription = async (projectId, description) => {
  const projectObj = (await fireStore.doc(`project/${projectId}`).get()).data();
  await fireStore.doc(`project/${projectId}`).update({
    ...projectObj,
    description,
  });
  alert('Sucessfully change project description');
};

const updateProjectChatList = async (projectId, chatList) => {
  const projectObj = (await fireStore.doc(`project/${projectId}`).get()).data();
  await fireStore.doc(`project/${projectId}`).update({
    ...projectObj,
    chatList,
  });
};

const deleteProjectChannel = async (projectId, deleteList, setIsDeleteDone) => {
  const projectObj = (await fireStore.doc(`project/${projectId}`).get()).data();
  const oldChatList = Array.from(projectObj.chatList);
  let chatList = [];
  let deleteChatIdList = [];
  for (let i = 0; i < oldChatList.length; i++) {
    let isDelete = false;
    for (let j = 0; j < Array.from(deleteList).length; j++) {
      if (oldChatList[i].name === deleteList[j]) {
        isDelete = true;
      }
    }
    if (isDelete) {
      deleteChatIdList = [...deleteChatIdList, oldChatList[i].id];
    } else {
      chatList = [...chatList, oldChatList[i]];
    }
  }
  await fireStore.doc(`project/${projectId}`).update({
    ...projectObj,
    chatList,
  });
  var docRef = fireStore.collection('haveToDelete').doc('chatList');
  docRef
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        let chatList = doc.data().chatList;
        chatList = [
          ...Array.from(chatList),
          {
            projectId: projectId,
            deleteList: deleteChatIdList,
          },
        ];
        await fireStore.collection('haveToDelete').doc('chatList').update({
          chatList,
        });
      } else {
        await fireStore
          .collection('haveToDelete')
          .doc('chatList')
          .set({
            chatList: [
              {
                projectId: projectId,
                deleteList: deleteChatIdList,
              },
            ],
          });
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });
  setIsDeleteDone(true);
  return Array.from(chatList);
};

const updateUserObj = async (userObj) => {
  try {
    if (userObj.userId) {
      await fireStore
        .collection('userList')
        .doc(userObj.userId)
        .update(userObj);
    }
  } catch (error) {
    console.log(userObj);
    console.error(error);
  }
};

const getProjectInfo = async (projectId, setFunc) => {
  let projectInfo = null;
  const bringProjectObj = fireStore
    .collection('project')
    .doc(projectId)
    .onSnapshot(async function (result) {
      const projectData = result.data();
      const userIdList = projectData.userInfo;
      const userObjList = await Promise.all(
        userIdList.map(async (userId) => {
          const userInfo = (
            await fireStore.collection('userList').doc(userId).get()
          ).data();
          return {
            name: userInfo.userName,
            userId: userInfo.userId,
            profileImg: userInfo.photoURL,
            email: userInfo.email,
          };
        })
      );
      projectInfo = {
        ...projectData,
        userObjList,
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
};

const findProjectWithName = async (projectName) => {
  const bringProjectList = await fireStore.collection('project').get();
  const projectList = await Promise.all(
    bringProjectList.docs.map(async (project) => {
      const data = project.data();
      if (data.projectInfo.projectName === projectName) {
        const leaderRef = (
          await fireStore.doc(`userList/${data.leaderId}`).get()
        ).data();
        const leaderObj = {
          name: leaderRef.userName,
          id: leaderRef.userId,
          email: leaderRef.email,
          profileImg: leaderRef.photoURL,
        };
        return {
          id: data.projectInfo.projectId,
          name: data.projectInfo.projectName,
          projectImg: data.projectInfo.projectImg,
          leader: leaderObj,
          createTime: data.createTime,
          description: data.description,
        };
      } else {
        return null;
      }
    })
  );
  let newProjectList = [];
  for (let i = 0; i < projectList.length; i++) {
    if (projectList[i]) {
      newProjectList.push(projectList[i]);
    }
  }
  if (newProjectList.length) {
    return newProjectList;
  } else {
    return null;
  }
};

const findUserWithEmail = async (email) => {
  const bringUserList = await fireStore.collection(`userList`).get();
  const userList = await Promise.all(
    bringUserList.docs.map(async (user) => {
      const data = user.data();
      if (data.email === email) {
        return {
          email: data.email,
          name: data.userName,
          userId: data.userId,
          profileImg: data.photoURL,
        };
      } else {
        return null;
      }
    })
  );
  for (let i = 0; i < userList.length; i++) {
    if (userList[i]) {
      return userList[i];
    }
  }
  return null;
};

const addProjectRequestUser = async (projectId, userObj) => {
  let data = (await fireStore.doc(`project/${projectId}`).get()).data();
  const oldRequestUserList = Array.from(data.requestUserList);
  const requestUserList = [
    ...oldRequestUserList,
    {
      userId: userObj.userId,
      userName: userObj.userName,
      profileImg: userObj.photoURL,
      email: userObj.email,
    },
  ];
  data.requestUserList = requestUserList;
  console.log(data);
  await fireStore.doc(`project/${projectId}`).update(data);
};

const addUserInProject = async (projectId, userId) => {
  const data = (await fireStore.doc(`project/${projectId}`).get()).data();
  const userInfo = [...data.userInfo, userId];
  await fireStore.doc(`project/${projectId}`).update({
    ...data,
    userInfo,
  });
  let chatroom = '';
  if (Array.from(data.chatList).length) {
    chatroom = data.chatList[0];
  }
  // let userObj = (
  //   await fireStore.collection('userList').doc(userId).get()
  // ).data();
  // const requestMessages = Array.from(userObj.requestMessages);
  // for (let i = 0; i < requestMessages.length; i++) {
  //   if (requestMessages[i].projectId === projectId) {
  //     requestMessages[i].state = 'fulfilled';
  //     break;
  //   }
  // }
  // userObj.requestMessages = requestMessages;
  // await fireStore.collection('userList').doc(userId).update(userObj);
  return {
    projectInfo: data.projectInfo,
    chatroom,
  };
};

const addProjectMember = async (projectId, userId, leaderObj) => {
  const projectObj = (await fireStore.doc(`project/${projectId}`).get()).data();
  const oldRequestUserList = Array.from(projectObj.requestUserList);
  let requestUserList = [];
  for (let i = 0; i < oldRequestUserList.length; i++) {
    if (oldRequestUserList[i].userId !== userId) {
      requestUserList = [...requestUserList, oldRequestUserList[i]];
    }
  }
  const userObj = (
    await fireStore.collection('userList').doc(userId).get()
  ).data();
  let requestMessages = Array.from(userObj.requestMessages);
  let noMessage = true;
  if (requestMessages.length) {
    for (let i = 0; requestMessages.length; i++) {
      const message = requestMessages[i];
      const projectId = message.projectId;
      if (message.projectId === projectId) {
        message.state = 'resolve';
        noMessage = false;
        break;
      }
    }
  }
  console.log(noMessage);
  console.log(leaderObj);
  console.log(userId);
  if (noMessage) {
    await sendAttendMessageWhenAddMember(
      projectObj.projectInfo,
      leaderObj,
      userId
    );
  } else {
    await fireStore
      .collection('userList')
      .doc(userId)
      .update({
        ...userObj,
        requestMessages,
      });
  }
  await fireStore.doc(`project/${projectId}`).update({
    ...projectObj,
    requestUserList,
  });
  return requestUserList;
};

const sendAttendMessageWhenAddMember = async (
  projectInfo,
  leaderObj,
  userId
) => {
  const requestObj = {
    leader: {
      email: leaderObj.email,
      id: leaderObj.userId,
      name: leaderObj.userName,
      profileImg: leaderObj.photoURL,
    },
    projectImg: projectInfo.projectImg,
    projectId: projectInfo.projectId,
    projectName: projectInfo.projectName,
    requestDate: Date.now(),
    state: 'request',
  };
  let userObj = (
    await fireStore.collection('userList').doc(userId).get()
  ).data();
  const requestMessages = [...userObj.requestMessages, requestObj];
  userObj.requestMessages = requestMessages;
  console.log(requestMessages);
  console.log(userObj);
  await fireStore.collection('userList').doc(userId).update(userObj);
};

const rejectRequestMember = async (projectId, userId) => {
  const projectObj = (await fireStore.doc(`project/${projectId}`).get()).data();
  const oldRequestUserList = Array.from(projectObj.requestUserList);
  let requestUserList = [];
  for (let i = 0; i < oldRequestUserList.length; i++) {
    if (oldRequestUserList[i].userId !== userId) {
      requestUserList = [...requestUserList, oldRequestUserList[i]];
    }
  }
  const userObj = (
    await fireStore.collection('userList').doc(userId).get()
  ).data();
  let requestMessages = Array.from(userObj.requestMessages);
  for (let i = 0; requestMessages.length; i++) {
    if (requestMessages[i].projectId === projectId) {
      requestMessages[i].state = 'reject';
      break;
    }
  }
  await fireStore
    .collection('userList')
    .doc(userId)
    .update({
      ...userObj,
      requestMessages,
    });
  await fireStore.doc(`project/${projectId}`).update({
    ...projectObj,
    requestUserList,
  });
  return requestUserList;
};

const sendAttendMessageWhenCreateProject = async (
  leaderObj,
  memberObjList,
  projectInfo
) => {
  const requestObj = {
    leader: {
      email: leaderObj.email,
      id: leaderObj.userId,
      name: leaderObj.userName,
      profileImg: leaderObj.photoURL,
    },
    projectImg: projectInfo.projectImg,
    projectId: projectInfo.projectId,
    projectName: projectInfo.projectName,
    requestDate: Date.now(),
    state: 'request',
  };
  console.log(requestObj);
  console.log(memberObjList);
  await Promise.all(
    Array.from(memberObjList).map(async (memberObj) => {
      const userId = memberObj.userId;
      let userObj = (
        await fireStore.collection('userList').doc(userId).get()
      ).data();
      console.log(userObj);
      const requestMessages = [...userObj.requestMessages, requestObj];
      userObj.requestMessages = requestMessages;
      console.log(requestMessages);
      console.log(userObj);
      await fireStore.collection('userList').doc(userId).update(userObj);
      return 'done';
    })
  );
};

//chatroom과 project를 추가할 때 특수문자는 안된다고 alert 넣기.
export {
  authWithEmailAndPassword,
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
  updateUserObj,
  getProjectInfo,
  findProjectWithName,
  findUserWithEmail,
  addProjectRequestUser,
  addUserInProject,
  updateProjectImg,
  updateProjectName,
  updateProjectDescription,
  updateProjectChatList,
  deleteProjectChannel,
  addProjectMember,
  rejectRequestMember,
  sendAttendMessageWhenCreateProject,
};
