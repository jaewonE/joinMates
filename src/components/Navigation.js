import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import 'components/css/Navigation.css';

const useSlideEvent = () => {
  const [navOpen, setNavOpen] = useState(false);
  const didMountRef = useRef(false);
  
  const changeBtnShape = (navOpen) => {
    let closeBtn = document.querySelector("#header-btn");
    if(navOpen) {
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    }else {
      closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
    }
  };
  useEffect(()=> {
    // let currentPath = window.location.hash;
    if (didMountRef.current) {
      document.querySelector(".sideBar").classList.toggle("open");
      // if(currentPath === '#/tchat') {
      //   document.querySelector(".chatList-wrapper").classList.toggle("open");
      //   document.querySelector(".chatList__search-margin").classList.toggle("open");
      // }
      changeBtnShape(navOpen);

    } else didMountRef.current = true;
  },[navOpen])
  return {setNavOpen};
}

const Navigation = ({userObj, setCurrentProject}) => {
  const {setNavOpen} = useSlideEvent();
  const setProjectPath = (e) => {
    console.log(e);
  }
  return (
    <React.Fragment>
      <link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet' />
      <div className="sideBar">
        <div className="header">
          <i className='bx bx-coffee'></i>
          <i onClick={()=>setNavOpen(prev=>!prev)} className='bx bx-menu' id="header-btn" ></i>
          <div className="header-name">JoinMates</div>
        </div>
        <ul className="projectList">
          <li className="nav-list">
            <Link className="a-link" to={{
                pathname: "/project/new",
                state: { fromDashboard: true }
            }}>
              <i className='bx bx-layer-plus'></i>
              <span className="links-name" id="create-project-btn">Create Project</span>
            </Link>
          </li>
          {userObj.projectList.map(projectObj => (
            <li key={projectObj.projectId} onClick={setProjectPath} className="nav-list">
              <Link className="a-link" key={projectObj.projectId} to={{
                pathname: "/project",
                hash: `#${projectObj.projectName}`,
                state: { fromDashboard: true }
              }}>
                {userObj.setting.seeProjectWithIcon?(
                  <i className='bx bxs-component'></i>
                ):(
                  <img src={projectObj.projectImg} alt="img" />
                )}
                <span className="links-name">{projectObj.projectName}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="footer">
          <li className="nav-list">
            <Link className="a-link" to="/profile">
              <i className='bx bx-user' ></i>
              <span className="links-name">Profile</span>
            </Link>
          </li>
          <li className="nav-list">
            <Link className="a-link" to="/setting">
              <i className='bx bx-cog' ></i>
              <span className="links-name">Setting</span>
            </Link>
          </li> 
        </ul>
      </div>
      <script
        src="https://kit.fontawesome.com/6478f529f2.js"
        crossOrigin="anonymous">
      </script>
    </React.Fragment>
  )
}

export default Navigation;

