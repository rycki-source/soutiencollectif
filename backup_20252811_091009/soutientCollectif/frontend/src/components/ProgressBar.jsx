import React from 'react';

const ProgressBar = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        >
          <span className="progress-text">{percentage.toFixed(0)}%</span>
        </div>
      </div>
      <div className="progress-info">
        <span className="progress-current">{current.toLocaleString()} €</span>
        <span className="progress-goal">Objectif: {goal.toLocaleString()} €</span>
      </div>
    </div>
  );
};

export default ProgressBar;
