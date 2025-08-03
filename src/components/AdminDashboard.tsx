import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  LogOut
} from 'lucide-react';
import EventsPage from './EventsPage';
import AssignmentPage from './AssignmentPage';

// Add mock data for events and certificates
const events = [
  {
    id: 1,
    title: 'Science Fair 2024',
    description: 'Annual science exhibition showcasing student projects and innovations.',
    date: '2024-02-15',
    time: '09:00',
    location: 'Main Auditorium',
    type: 'live' as const,
    participants: 150,
    maxParticipants: 200,
    status: 'open' as const
  },
  {
    id: 2,
    title: 'Sports Day',
    description: 'Inter-house sports competition with various athletic events.',
    date: '2024-02-20',
    time: '08:00',
    location: 'Sports Ground',
    type: 'upcoming' as const,
    participants: 89,
    maxParticipants: 300,
    status: 'open' as const
  },
  {
    id: 3,
    title: 'Cultural Festival',
    description: 'Celebration of arts, music, and cultural diversity.',
    date: '2024-01-30',
    time: '18:00',
    location: 'School Campus',
    type: 'completed' as const,
    participants: 245,
    status: 'closed' as const
  },
  {
    id: 4,
    title: 'Math Olympiad',
    description: 'Regional mathematics competition for talented students.',
    date: '2024-02-25',
    time: '10:00',
    location: 'Computer Lab',
    type: 'upcoming' as const,
    participants: 45,
    maxParticipants: 50,
    status: 'open' as const
  },
  {
    id: 5,
    title: 'Parent-Teacher Meeting',
    description: 'Quarterly meeting to discuss student progress.',
    date: '2024-01-25',
    time: '14:00',
    location: 'Classrooms',
    type: 'completed' as const,
    participants: 180,
    status: 'closed' as const
  }
];

const certificates = [
  {
    id: 1,
    eventId: 3,
    eventTitle: 'Cultural Festival',
    studentName: 'John Doe',
    issueDate: '2024-02-01',
    certificateType: 'Participation',
    status: 'issued' as const
  },
  {
    id: 2,
    eventId: 3,
    eventTitle: 'Cultural Festival',
    studentName: 'Jane Smith',
    issueDate: '2024-02-01',
    certificateType: 'Excellence',
    status: 'issued' as const
  },
  {
    id: 3,
    eventId: 5,
    eventTitle: 'Parent-Teacher Meeting',
    studentName: 'Mike Johnson',
    issueDate: '2024-01-26',
    certificateType: 'Attendance',
    status: 'pending' as const
  },
  {
    id: 4,
    eventId: 1,
    eventTitle: 'Science Fair 2024',
    studentName: 'Sarah Wilson',
    issueDate: '',
    certificateType: 'Achievement',
    status: 'draft' as const
  }
];

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'events' | 'assignments'>('dashboard');

  // Mock data
  const stats = {
    totalStudents: 1247,
    totalTeachers: 89,
    totalClasses: 156,
    averageAttendance: 94.2
  };

  const recentStudents = [
    { id: 1, name: 'John Doe', class: '10-A', attendance: 95, grade: 'A', status: 'Active' },
    { id: 2, name: 'Jane Smith', class: '10-B', attendance: 88, grade: 'B+', status: 'Active' },
    { id: 3, name: 'Mike Johnson', class: '9-A', attendance: 92, grade: 'A-', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', class: '11-C', attendance: 97, grade: 'A+', status: 'Active' },
    { id: 5, name: 'David Brown', class: '10-A', attendance: 85, grade: 'B', status: 'Warning' }
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrolled', user: 'John Doe', time: '2 hours ago', type: 'enrollment' },
    { id: 2, action: 'Assignment submitted', user: 'Jane Smith', time: '4 hours ago', type: 'assignment' },
    { id: 3, action: 'Attendance marked', user: 'Class 10-A', time: '6 hours ago', type: 'attendance' },
    { id: 4, action: 'Grade updated', user: 'Mike Johnson', time: '8 hours ago', type: 'grade' },
    { id: 5, action: 'Event scheduled', user: 'Science Fair', time: '1 day ago', type: 'event' }
  ];

  const handleTabChange = (tab: string) => {
    if (tab === 'events') {
      setCurrentView('events');
    } else if (tab === 'assignments') {
      setCurrentView('assignments');
    } else {
      setActiveTab(tab);
      setCurrentView('dashboard');
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setActiveTab('overview');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Warning': return 'text-yellow-600 bg-yellow-100';
      case 'Inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users size={16} className="text-blue-500" />;
      case 'assignment': return <BookOpen size={16} className="text-green-500" />;
      case 'attendance': return <Calendar size={16} className="text-purple-500" />;
      case 'grade': return <BarChart3 size={16} className="text-orange-500" />;
      case 'event': return <Bell size={16} className="text-red-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  // Show events page if selected
  if (currentView === 'events') {
    return <EventsPage onBack={handleBackToDashboard} userType="admin" events={events} certificates={certificates} />;
  }

  // Show assignments page if selected
  if (currentView === 'assignments') {
    return <AssignmentPage onBack={handleBackToDashboard} userType="admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'teachers', label: 'Teachers', icon: BookOpen },
              { id: 'classes', label: 'Classes', icon: Calendar },
              { id: 'assignments', label: 'Assignments', icon: BookOpen },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <BookOpen className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Classes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Attendance</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.averageAttendance}%</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <BarChart3 className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Students and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Students */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">Class {student.class}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">Grade: {student.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.user}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Student Management</h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={16} />
                    Add Student
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="text-blue-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.attendance}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye size={16} />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs content placeholder */}
        {activeTab !== 'overview' && activeTab !== 'students' && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;