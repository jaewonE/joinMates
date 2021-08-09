import React from 'react';

const EditProjectNavigation = ({
  setIsEditProjectCard,
  setIsEditChannelCard,
  setIsEditMemberCard,
  setIsEditRequestCard,
}) => {
  const setCard = (e) => {
    const {
      target: { id },
    } = e;
    const editProject = document.querySelector('#navi-editProject');
    const editChannel = document.querySelector('#navi-editChannel');
    const editMember = document.querySelector('#navi-editMember');
    const editRequest = document.querySelector('#navi-RequestCard');
    editProject.classList.remove('focus');
    editChannel.classList.remove('focus');
    editMember.classList.remove('focus');
    editRequest.classList.remove('focus');
    if (id === 'navi-editProject') {
      editProject.classList.add('focus');
      setIsEditProjectCard(true);
      setIsEditChannelCard(false);
      setIsEditMemberCard(false);
      setIsEditRequestCard(false);
    } else if (id === 'navi-editChannel') {
      editChannel.classList.add('focus');
      setIsEditProjectCard(false);
      setIsEditChannelCard(true);
      setIsEditMemberCard(false);
      setIsEditRequestCard(false);
    } else if (id === 'navi-editMember') {
      editMember.classList.add('focus');
      setIsEditProjectCard(false);
      setIsEditChannelCard(false);
      setIsEditMemberCard(true);
      setIsEditRequestCard(false);
    } else if (id === 'navi-RequestCard') {
      editRequest.classList.add('focus');
      setIsEditProjectCard(false);
      setIsEditChannelCard(false);
      setIsEditMemberCard(false);
      setIsEditRequestCard(true);
    }
  };
  return (
    <div className="editProjectNavigation-wrapper">
      <div
        className="editProject-navi focus"
        id="navi-editProject"
        onClick={setCard}
      >
        <span>Project</span>
      </div>
      <div className="editProject-navi" id="navi-editChannel" onClick={setCard}>
        <span>Channels</span>
      </div>
      <div className="editProject-navi" id="navi-editMember" onClick={setCard}>
        <span>Members</span>
      </div>
      <div className="editProject-navi" id="navi-RequestCard" onClick={setCard}>
        <span>Request Messages</span>
      </div>
    </div>
  );
};

export default EditProjectNavigation;
