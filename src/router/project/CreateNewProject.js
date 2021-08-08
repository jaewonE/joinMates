import { createProject } from 'components/fComponents';
import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import CreateNewProjectFriendsCard from 'router/project/CreateNewProjectFriendsCard';

const CreateNewProject = ({ userObj, setUserObj, setCreateProjectName }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTitleWrapper, setIsTitleWapper] = useState(true);
  const [isProfileImgWrapper, setIsProfileImgWrapper] = useState(true);
  const [memberList, setMemberList] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [titleWarn, setTitleWarn] = useState('');
  const [projectImg, setProjectImg] = useState('');
  const [sizeOfTitle, setSizeOfTitle] = useState([0, 0]);
  const defaultProjectImg =
    'https://firebasestorage.googleapis.com/v0/b/joinmates-7701.appspot.com/o/defaultProjectImg.jpg?alt=media&token=f93b15f0-bd72-4b93-b031-9a5d4631cae9';

  const getTitleLen = (title) => {
    //한글은 한글자당 2, 영어는 한글자당 1
    let size = sizeOfTitle;
    const titleSize = Buffer.byteLength(title, 'utf8');
    if (size[0] !== titleSize) {
      switch (titleSize - size[0]) {
        case 3:
          size = [titleSize, size[1] + 2];
          break;
        case 1:
          size = [titleSize, size[1] + 1];
          break;
        case -1:
          size = [titleSize, size[1] - 1];
          break;
        case -3:
          size = [titleSize, size[1] - 2];
          break;
        default:
          alert('한글과 영어만 입력이 가능합니다.');
          break;
      }
    }
    setSizeOfTitle(size);
    return size[1];
  };

  const onChangeTitle = (e) => {
    const {
      target: { value },
    } = e;
    const title = String(value);
    const titleLength = getTitleLen(title);
    if (title.indexOf(' ') + 1) {
      setTitleWarn('띄워쓰기 없이 입력해주십시오');
    } else if (titleLength > 14) {
      setTitleWarn('한글은 7글자, 영어는 14글자까지만 가능합니다');
    } else {
      setTitleWarn('');
    }
    setTitleInput(value);
  };
  const handleClick = async (e) => {
    if (!titleWarn) {
      setIsFlipped((prev) => !prev);
      if (isTitleWrapper) {
        setTimeout(() => {
          setIsTitleWapper(false);
        }, 500);
      } else {
        setTimeout(() => {
          setIsProfileImgWrapper(false);
        }, 500);
      }
    }
  };
  const getProjectImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async (evt) => {
        const imgURL = await evt.currentTarget.result;
        setProjectImg(imgURL);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };
  const setProject = async (e) => {
    e.preventDefault();
    const description = document.querySelector('#description-paper').value;
    const memberIdList = memberList.map((member) => {
      return member.userId;
    });
    memberIdList.push(userObj.userId);
    const projectInfo = await createProject({
      userObj,
      projectName: titleInput,
      projectImgDataURL: projectImg,
      memberIdList,
      description: description,
    });
    const projectList = [...userObj.projectList, projectInfo];
    const lastEditedProjectList = [
      ...userObj.lastEditedProjectList,
      {
        projectPath: {
          id: projectInfo.projectId,
          name: projectInfo.projectName,
        },
        chatroomPath: '',
      },
    ];
    await setUserObj({
      ...userObj,
      projectList,
      lastEditedProjectList,
    });
    await setCreateProjectName({
      id: projectInfo.projectId,
      name: projectInfo.projectName,
    });
    alert('sucessfully create projcet');
  };
  return (
    <div className="createNewProject-container">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {isTitleWrapper ? (
          <form
            onSubmit={handleClick}
            className="createNewProject-card title-wrapper"
          >
            <input
              className="title-input"
              required
              type="text"
              onChange={onChangeTitle}
              value={titleInput}
              placeholder="Enter Project Name"
            />
            {titleWarn ? (
              <span className="title-warn">{titleWarn}</span>
            ) : (
              <React.Fragment>
                <label
                  className="card-submit__label"
                  htmlFor="title__submit-btn"
                >
                  <i className="bx bx-right-arrow-circle bx-flip-vertical"></i>
                </label>
                <input
                  className="card-submit"
                  id="title__submit-btn"
                  type="submit"
                  value="Click to flip"
                />
              </React.Fragment>
            )}
          </form>
        ) : (
          <CreateNewProjectFriendsCard
            userObj={userObj}
            handleClick={handleClick}
            memberList={memberList}
            setMemberList={setMemberList}
          />
        )}
        {isProfileImgWrapper ? (
          <form
            onSubmit={handleClick}
            className="createNewProject-card projectImg-wrapper"
          >
            <img
              src={projectImg ? projectImg : defaultProjectImg}
              alt="Project_img"
            />
            <label htmlFor="newProjectImg">Change Project Image</label>
            <input
              type="file"
              id="newProjectImg"
              accept="image/*"
              onChange={getProjectImg}
              value=""
            />
            <input
              className="card-submit"
              id="projectImg-btn"
              type="submit"
              value="Select this image"
            />
          </form>
        ) : (
          <div className="createNewProject-card description-wrapper">
            <div className="description-title">Project Description</div>
            <div className="paper">
              <div className="paper-content">
                <textarea
                  id="description-paper"
                  maxLength="80"
                  minLength="10"
                  autoFocus
                  placeholder="The maximum number of characters is 80"
                ></textarea>
              </div>
            </div>
            <input
              className="description__submit-btn"
              type="submit"
              onClick={setProject}
              value="create project"
            />
          </div>
        )}
      </ReactCardFlip>
    </div>
  );
};

export default CreateNewProject;
