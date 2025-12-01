import React from 'react';
import ProgressBar from './ProgressBar';

const CampaignCard = ({ campaign, onDonate }) => {
  return (
    <div className="campaign-card">
      <div className="campaign-image">
        <img src={campaign.image} alt={campaign.title} />
        <span className="campaign-badge">{campaign.category}</span>
      </div>
      <div className="campaign-content">
        <h3 className="campaign-title">{campaign.title}</h3>
        <p className="campaign-description">{campaign.description}</p>
        
        <ProgressBar current={campaign.raised} goal={campaign.goal} />
        
        <div className="campaign-meta">
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <span>{campaign.backers} donateurs</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏰</span>
            <span>{campaign.daysLeft} jours restants</span>
          </div>
        </div>
        
        <button 
          className="btn-donate" 
          onClick={() => onDonate(campaign)}
        >
          Faire un don ❤️
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;
