import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

type UserType = 'student' | 'admin' | null;

function App() {
  const [currentUser, setCurrentUser] = useState<UserType>(null);

  const handleLogin = (userType: UserType) => {
    setCurrentUser(userType);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <StudentDashboard onLogout={handleLogout} />;
}

export default App;