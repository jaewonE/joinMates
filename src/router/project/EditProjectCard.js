import {
  updateProjectDescription,
  updateProjectImg,
  updateProjectName,
} from 'components/fComponents';
import React, { useState } from 'react';

const EditProjectCard = ({ projectObj }) => {
  const [projectImg, setProjectImg] = useState(
    projectObj.projectInfo.projectImg
  );
  const [projectName, setProjectName] = useState(
    projectObj.projectInfo.projectName
  );
  const [description, setDescription] = useState(projectObj.description);
  const [sizeOfTitle, setSizeOfTitle] = useState([0, 0]);

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

  const isRightTitle = () => {
    const title = String(projectName);
    const titleLength = getTitleLen(title);
    if (title.indexOf(' ') + 1) {
      alert('띄워쓰기 없이 입력해주십시오');
      return false;
    } else if (titleLength > 14) {
      alert('한글은 7글자, 영어는 14글자까지만 가능합니다');
      return false;
    } else {
      return true;
    }
  };

  const onChange = (e) => {
    let { id, value } = e.target;
    if (id === 'projectName') {
      const title = String(value);
      getTitleLen(title);
      setProjectName(value);
    } else if (id === 'editProject__description') {
      setDescription(value);
    }
  };
  const changeProjectImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async (evt) => {
        const imgURL = await evt.currentTarget.result;
        const imageURL = await updateProjectImg(
          projectObj.projectInfo.projectId,
          imgURL
        );
        if (imageURL) {
          setProjectImg(imageURL);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };
  const changeProjectName = () => {
    if (isRightTitle) {
      updateProjectName(projectObj.projectInfo.projectId, projectName);
    }
  };
  const changeDescription = () => {
    updateProjectDescription(projectObj.projectInfo.projectId, description);
  };
  return (
    <div className="editProject-wrapper">
      <div className="editprojectImg-wrapper">
        <img src={projectImg} alt="project_img" />
        <label htmlFor="uploadImg">Change Project Image</label>
        <input
          type="file"
          id="uploadImg"
          accept="image/*"
          onChange={changeProjectImg}
        />
      </div>
      <div className="editProject-info">
        <input
          className="hidden_input editProject-name btn-x"
          value="Update"
          type="button"
          onClick={changeProjectName}
        />
        <label className="_label editProject-name" htmlFor="projectName">
          Name
        </label>
        <input
          className="_input"
          required
          type="text"
          onChange={onChange}
          id="projectName"
          value={projectName}
        />
        <label
          className="_label editProject-description"
          htmlFor="editProject__description"
        >
          Description
        </label>
        <textarea
          className="_input"
          onChange={onChange}
          id="editProject__description"
          value={description}
        />
        <input
          className="hidden_input editProject-description btn-x"
          value="Update"
          id="editProject__description-btn"
          type="button"
          onClick={changeDescription}
        />
      </div>
    </div>
  );
};

export default EditProjectCard;
