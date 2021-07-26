import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import 'components/css/Navigation.css';
import { v4 as uuidv4 } from "uuid";  //키값을 위해 임시로 가져옴. 나중에 userInfo에서 ProjectList를 가져오면 projectKey값으로 할 것.

const useSlideEvent = (nowPage) => {
  const [navOpen, setNavOpen] = useState(false);
  const didMountRef = useRef(false);
  
  const changeBtnShape = (navOpen) => {
    let closeBtn = document.querySelector("#btn");
    if(navOpen) {
      closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    }else {
      closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
    }
  };
  useEffect(()=> {
    let currentPath = window.location.hash;
    if (didMountRef.current) {
      document.querySelector(".sidebar").classList.toggle("open");
      if(currentPath === '#/tchat') {
        document.querySelector(".chatList-wrapper").classList.toggle("open");
        document.querySelector(".chatList__search-margin").classList.toggle("open");
      }
      changeBtnShape(navOpen);

    } else didMountRef.current = true;
  },[navOpen])
  return {setNavOpen};
}

const Navigation = ({projectList}) => {
  const {setNavOpen} = useSlideEvent();
  return (
    <React.Fragment>
      <link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet' />
      <div className="sidebar">
        <div className="logo-details">
          <i className='bx bx-coffee'></i>
          <div className="logo_name">JoinMates</div>
          <i onClick={()=>setNavOpen(prev=>!prev)} className='bx bx-menu' id="btn" ></i>
        </div>
        <ul className="nav-list">
          <li>
            <i onClick={()=>setNavOpen(prev=>!prev)} id='search-icon' className='bx bx-search' ></i>
            <input type="text" placeholder="Fast Search" />
          </li>
          <li>
          {projectList.map(project => (
            <Link className="a-link projects" key={uuidv4()} to={{
              pathname: "/project",
              hash: `#${project}`,
              state: { fromDashboard: true }
              }}>
              <i class='bx bxs-component'></i>
              <span className="links_name">{project}</span>
            </Link>
          ))}
          </li>
          <li className="nav-list__bottom-fixed">
            <Link className="a-link" to="/profile">
              <i className='bx bx-user' ></i>
              <span className="links_name">Profile</span>
            </Link>
          </li>
          <li className="nav-list__bottom-fixed">
            <Link className="a-link" to="/setting">
              <i className='bx bx-cog' ></i>
              <span className="links_name">Setting</span>
            </Link>
          </li> 
        </ul>
      </div>
      <div className="home-section">
      </div>
      <script
        src="https://kit.fontawesome.com/6478f529f2.js"
        crossOrigin="anonymous">
      </script>
    </React.Fragment>
  )
}

export default Navigation;


{/* <li>
<Link className="a-link" to="/profile">
  <i className='bx bx-user' ></i>
  <span className="links_name">Profile</span>
</Link>
</li>
<li>
<Link className="a-link" to="/pchat">
  <i className='bx bxs-message-rounded'></i>
  <span className="links_name">Personal Messages</span>
</Link>
</li>
<li>
<Link className="a-link" to="/tchat">
  <i className='bx bx-chat' ></i>
  <span className="links_name">Team Messages</span>
</Link>
</li>
<li>
<Link className="a-link" to="/setting">
  <i className='bx bx-cog' ></i>
  <span className="links_name">Setting</span>
</Link>
</li> */}

