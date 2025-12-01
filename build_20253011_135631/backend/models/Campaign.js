import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  goal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  raised: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  backers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  daysLeft: {
    type: DataTypes.INTEGER
  },
  endDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  createdBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

Campaign.prototype.getPercentageReached = function() {
  return this.goal > 0 ? (this.raised / this.goal) * 100 : 0;
};

Campaign.prototype.getDaysRemaining = function() {
  if (!this.endDate) return this.daysLeft || 0;
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default Campaign;
