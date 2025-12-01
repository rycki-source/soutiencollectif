import User from './User.js';
import Campaign from './Campaign.js';
import Donation from './Donation.js';

// Relations
User.hasMany(Campaign, { foreignKey: 'createdBy', as: 'campaigns' });
Campaign.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Donation, { foreignKey: 'donorId', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });

Campaign.hasMany(Donation, { foreignKey: 'campaignId', as: 'donations' });
Donation.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });

export { User, Campaign, Donation };
