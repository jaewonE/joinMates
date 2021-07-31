import React, { useEffect } from 'react';
const Project = ({currentProject}) => {
    useEffect(()=> {
        console.log(currentProject);
    },[currentProject])
    return (
        <div className="project-wrapper">
            <div className="area1">area1</div>
            <div className="area2">{currentProject}</div>
        </div>
    )
}

export default Project;