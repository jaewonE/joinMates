import React, { useEffect } from 'react';

const Tchat = ({userObj}) => {
    useEffect(()=> {
        console.log("Tchat");
        console.log(userObj);
    },[userObj])
    return (<h1>Team chat</h1>)
}

export default Tchat;