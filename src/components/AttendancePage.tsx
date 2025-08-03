import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendancePageProps {
  onBack: () => void;
  attendanceStats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendancePercentage: number;
  };
  recentAttendance: AttendanceRecord[];
  missedClasses: MissedClass[];
}

interface AttendanceRecord {
  id: number;
  date: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  time: string;
}

interface MissedClass {
  id: number;
  date: string;
  subject: string;
  reason: string;
  duration: string;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ onBack, attendanceStats, recentAttendance, missedClasses }) => {
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadStatus('File selected: ' + file.name);
      
      // Simulate upload process
      setTimeout(() => {
        setUploadStatus('Leave letter uploaded successfully!');
        setTimeout(() => {
          setUploadStatus('');
        }, 3000);
      }, 1500);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'absent':
        return <XCircle className="text-red-500" size={20} />;
      case 'late':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-100';
      case 'absent':
        return 'text-red-600 bg-red-100';
      case 'late':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold text-slate-800 tracking-wide">
              ATTENDANCE
            </h1>
          </div>
        </div>

        {/* Attendance Scorecard */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            ATTENDANCE SCORECARD:
          </h2>
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-3xl font-bold">{attendanceStats.attendancePercentage}%</span>
              <span className="text-white text-sm">
                {attendanceStats.presentDays}/{attendanceStats.totalDays} days
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${attendanceStats.attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Days Present and Absent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">DAYS PRESENT</h3>
            <div className="bg-gray-50 rounded-lg p-6 h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{attendanceStats.presentDays}</div>
                <div className="text-sm text-gray-600">out of {attendanceStats.totalDays} days</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">DAYS ABSENT</h3>
            <div className="bg-gray-50 rounded-lg p-6 h-32 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{attendanceStats.absentDays}</div>
                <div className="text-sm text-gray-600">missed classes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attendance Records */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Recent Attendance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.subject}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.time}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Missed Classes */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">MISSED CLASSES</h3>
          <div className="space-y-4">
            {missedClasses.map((missedClass) => (
              <div key={missedClass.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{missedClass.subject}</h4>
                    <p className="text-sm text-gray-600">{new Date(missedClass.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Reason: {missedClass.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{missedClass.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Letter Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <div className="flex flex-col items-center gap-4">
              <Upload className="text-gray-400" size={48} />
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">LEAVE LETTER UPLOAD</h3>
                <p className="text-gray-600 mb-4">Upload your leave letter for absent days</p>
                
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Upload size={20} />
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {uploadStatus && (
                <div className={`mt-4 p-3 rounded-lg ${
                  uploadStatus.includes('successfully') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Calendar View */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Monthly Overview</h3>
          <div className="grid grid-cols-7 gap-2 text-center">
            {/* Calendar header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 font-semibold text-gray-600 text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days (simplified for demo) */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isPresent = Math.random() > 0.1; // 90% attendance simulation
              const isToday = day === 15;
              
              return (
                <div
                  key={day}
                  className={`p-2 text-sm rounded-lg ${
                    isToday 
                      ? 'bg-blue-600 text-white' 
                      : isPresent 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2">
          <button className="w-3 h-3 rounded-full bg-slate-700"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;