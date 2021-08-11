import React, { useState } from 'react';
import EditChannelCard from 'router/project/EditChannelCard';
import EditMemberCard from 'router/project/EditMemberCard';
import EditProjectCard from 'router/project/EditProjectCard';
import EditProjectNavigation from 'router/project/EditProjectNavigation';
import EditRequestMessageCard from 'router/project/EditRequestMessageCard';

const EditProjectInfo = ({ projectObj }) => {
  const [isEditProjectCard, setIsEditProjectCard] = useState(true);
  const [isEditchannelCard, setIsEditChannelCard] = useState(false);
  const [isEditMemberCard, setIsEditMemberCard] = useState(false);
  const [isEditRequestCard, setIsEditRequestCard] = useState(false);
  return (
    <div className="editProjectInfo-container">
      <div className="editProjectInfo-wrapper">
        <EditProjectNavigation
          setIsEditProjectCard={setIsEditProjectCard}
          setIsEditChannelCard={setIsEditChannelCard}
          setIsEditMemberCard={setIsEditMemberCard}
          setIsEditRequestCard={setIsEditRequestCard}
        />
        {isEditProjectCard && <EditProjectCard projectObj={projectObj} />}
        {isEditchannelCard && <EditChannelCard projectObj={projectObj} />}
        {isEditMemberCard && <EditMemberCard />}
        {isEditRequestCard && <EditRequestMessageCard />}
      </div>
    </div>
  );
};

export default EditProjectInfo;
