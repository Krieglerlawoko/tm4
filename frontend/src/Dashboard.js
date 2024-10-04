import React from 'react';

function Dashboard({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div>
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
        <p>Progress: {progressPercentage}%</p>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
