import React, { useState } from 'react';
import { Eye, EyeOff, Flame } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userType: 'student' | 'admin') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock user credentials
  const mockUsers = {
    'student': { password: 'student123', type: 'student' as const },
    'admin': { password: 'admin123', type: 'admin' as const },
    'john.doe': { password: 'password', type: 'student' as const },
    'jane.smith': { password: 'password', type: 'student' as const }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers[username as keyof typeof mockUsers];
    
    if (user && user.password === password) {
      onLogin(user.type);
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here.\n\nDemo credentials:\n- Username: student, Password: student123\n- Username: admin, Password: admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="w-full h-full rounded-full border-4 border-slate-700 flex items-center justify-center bg-white">
              <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-20"></div>
                <Flame className="w-8 h-8 text-red-500 z-10" />
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                </div>
                <div className="absolute top-2 left-3">
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                </div>
                <div className="absolute top-2 right-3">
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                </div>
                <div className="absolute bottom-2 left-1/4">
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                </div>
                <div className="absolute bottom-2 right-1/4">
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Decorative elements around the logo */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-2 border-red-500 transform rotate-45"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-red-500 transform rotate-45"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-2 border-red-500 transform rotate-45"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-2 border-red-500 transform rotate-45"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            VAISHNAV
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            EDUTECH
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-800 text-center mb-6">
            LOGIN
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-slate-600 hover:text-slate-800 transition-colors text-sm"
            >
              Forgot password?
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 text-center mb-2 font-semibold">Demo Credentials:</p>
          <div className="text-xs text-slate-500 space-y-1">
            <p><strong>Student:</strong> username: student, password: student123</p>
            <p><strong>Admin:</strong> username: admin, password: admin123</p>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <button className="w-3 h-3 rounded-full bg-slate-700"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;