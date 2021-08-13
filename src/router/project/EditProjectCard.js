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

  const defineLenght = (testString, limitScore) => {
    const limit = Number(limitScore) + 1;
    var check_num = /[0-9]/; // 숫자
    var check_eng = /[a-zA-Z]/; // 문자
    // var check_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    var check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
    let i = 0;
    let total = 0;
    let notPermit = false;
    for (i = 0; i < String(testString).length; i++) {
      if (check_eng.test(testString[i])) {
        total += 1;
      } else if (check_kor.test(testString[i])) {
        total += 2;
      } else if (check_num.test(testString[i])) {
        total += 1;
      } else {
        notPermit = true;
        break;
      }
    }
    if (notPermit) {
      return 'notPermitInput';
    } else {
      if (total >= limit) {
        return 'overLimit';
      } else {
        return null;
      }
    }
  };

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
        if (imageURL) {
          setProjectImg(imageURL);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };
  const changeProjectName = () => {
    const error = defineLenght(projectName, 14);
    if (error) {
      if (error === 'notPermitInput') {
        alert('숫자, 영어, 한글을 제외한 특수문자, 공백은 허용되지 않습니다');
      } else if (error === 'overLimit') {
        alert('한글은 7글자, 영어와 숫자는 14글자만 가능합니다');
      }
    } else {
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
