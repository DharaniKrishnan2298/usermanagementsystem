import React from 'react';
import './App.css';
import UserManagement from './components/UserManagement';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>User Management Dashboard</h1>
      <UserManagement />
    </div>
  );
};

export default App;
