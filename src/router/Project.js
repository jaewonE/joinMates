import React from 'react';
const Project = ({projectPath, chatroomPath, setChatroomPath}) => {
    return (
        <div className="project-wrapper">
            <div className="area1">area1</div>
            <div className="area2">{projectPath.name}</div>
        </div>
    )
}

export default Project;