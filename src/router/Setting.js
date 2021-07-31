import React, { useEffect, useState } from "react";

const useSeeProjectWithIcon = (userObj, setUserObj) => {
  const [seeProjectWithIcon, setSeeProjectWithIcon] = useState(userObj.setting.seeProjectWithIcon);
  useEffect(()=> {
    const setting = userObj.setting;
    if(seeProjectWithIcon !== setting.seeProjectWithIcon) {
      setUserObj({
        ...userObj,
        setting: {
          ...setting,
          seeProjectWithIcon
        }
      });
    }
    const naviIconSwitch = document.getElementById('naviIconSwitch');
    if(seeProjectWithIcon) {
      naviIconSwitch.checked = false;
    } else {
      naviIconSwitch.checked = true;
    }
  },[seeProjectWithIcon, userObj, setUserObj]);
  return setSeeProjectWithIcon;
}

const Setting = ({userObj, setUserObj}) => {
  const setSeeProjectWithIcon = useSeeProjectWithIcon(userObj, setUserObj);
  const switchCase = (e) => {
    const {target: {id}} = e;
    if(id === "naviIconSwitch") {
      setSeeProjectWithIcon(prev => !prev);
    }
  }
  return(
    <div className="setting-container">
      <div className="setting-wrapper">
        <div className='setting-box naviIconChanger'>
          <div className='setting-box__title'>See project preview with</div>
          <div className="checkbox-wrapper">
            <input type="checkbox" id="naviIconSwitch" onClick={switchCase}/>
            <div className="checkbox-inner">
              <label htmlFor="naviIconSwitch"></label>
              <span></span>
            </div>
            <div className="checkbox__left">Icon</div>
            <div className="checkbox__right">Image</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting;
