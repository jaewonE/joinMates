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
  const onChange = (e) => {
    let { id, value } = e.target;
    if (id === 'projectName') {
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
        console.log(imageURL);
        if (imageURL) {
          setProjectImg(imageURL);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };
  const changeProjectName = () => {
    updateProjectName(projectObj.projectInfo.projectId, projectName);
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
