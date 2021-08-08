import { createChatroom } from 'components/fComponents';
import React, { useState } from 'react';

const CreateNewChatroom = ({userObj, setUserObj, projectPath, setChatroomPath}) => {
    const [inputValue, setInputValue] = useState("");
    const onChange = (e) => {
        const {target: {value}} = e;
        setInputValue(value);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        createChatroom({
            userObj,
            path: {
                projectPath,
                chatroomPath: inputValue
            }
        }); 
        let lastEditedProjectList = userObj.lastEditedProjectList;
        for(let i=0; i<lastEditedProjectList.length;i++) {
            if(lastEditedProjectList[i].projectPath.name === projectPath.name) {
                lastEditedProjectList[i].chatroomPath = inputValue;
                setUserObj({
                    ...userObj,
                    lastEditedProjectList
                });
             };
        };
        setChatroomPath(inputValue); 
    }
    return(
        <div className='createNewChatroom-container'>
            <form className='createNewChatroom-wrapper' onSubmit={onSubmit}>
                <input type='text' placeholder='Enter channel name' onChange={onChange} value={inputValue}/>
                <input type='submit' value='create channel'/>
            </form>
        </div>
    );
}

export default CreateNewChatroom;
