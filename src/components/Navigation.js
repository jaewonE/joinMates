import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import 'components/css/Navigation.css';

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

const Navigation = () => {
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
          </li>
        </ul>
      </div>
      {/* <div className="home-section">
        <div className="text">Dashboard</div>
      </div> */}
      <script
        src="https://kit.fontawesome.com/6478f529f2.js"
        crossOrigin="anonymous">
      </script>
    </React.Fragment>
  )
}

export default Navigation;

// {/* <li className="profile">
// <div className="profile-details">
//   <i className='bx bx-award'></i>
//   <div className="name_job">
//     <div className="name">Kwak Jaewon</div>
//     <div className="job">Web designer</div>
//   </div>
// </div>
// <i className='bx bx-log-out' id="log_out" ></i>
// </li> */}

// {/* <nav>
// <ul>
//   <li> <Link to="/profile">profile</Link> </li>
//   <li> <Link to="/pchat">personal chat</Link> </li>
//   <li> <Link to="/tchat">team chat</Link> </li>
//   <li> <Link to="/setting">setting</Link> </li>
// </ul>
// </nav> */}