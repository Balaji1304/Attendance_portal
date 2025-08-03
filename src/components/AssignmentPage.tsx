import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  CheckCircle, 
  FileText,
  Save,
  X
} from 'lucide-react';

interface AssignmentPageProps {
  onBack: () => void;
  userType: 'student' | 'admin';
  assignments: Assignment[];
  submissions: Submission[];
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  status: 'live' | 'completed' | 'overdue';
  totalMarks: number;
  submittedBy?: number;
  submissions?: number;
  maxSubmissions?: number;
  createdBy: string;
  createdDate: string;
}

interface Submission {
  id: number;
  assignmentId: number;
  studentName: string;
  studentId: string;
  submissionDate: string;
  submissionTime: string;
  fileName: string;
  status: 'submitted' | 'graded' | 'late';
  marks?: number;
  feedback?: string;
}

interface AssignmentFormData {
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  totalMarks: string;
  maxSubmissions: string;
}

const AssignmentPage: React.FC<AssignmentPageProps> = ({ onBack, userType, assignments, submissions }) => {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for adding/editing assignments
  const [assignmentForm, setAssignmentForm] = useState<AssignmentFormData>({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    dueTime: '',
    totalMarks: '',
    maxSubmissions: ''
  });

  const liveAssignments = assignments.filter(assignment => assignment.status === 'live');
  const completedAssignments = assignments.filter(assignment => assignment.status === 'completed');
  const overdueAssignments = assignments.filter(assignment => assignment.status === 'overdue');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, assignmentId?: number) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadStatus(`File selected: ${file.name}`);
      
      setTimeout(() => {
        setUploadStatus('Assignment uploaded successfully!');
        
        // Add new submission for student
        if (userType === 'student' && assignmentId) {
          const newSubmission: Submission = {
            id: submissions.length + 1,
            assignmentId: assignmentId,
            studentName: 'Current Student',
            studentId: 'STU999',
            submissionDate: new Date().toISOString().split('T')[0],
            submissionTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            fileName: file.name,
            status: 'submitted'
          };
          // setSubmissions(prev => [...prev, newSubmission]); // This line was removed as per new_code
        }
        
        setTimeout(() => {
          setUploadStatus('');
        }, 3000);
      }, 1500);
    }
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      dueTime: '',
      totalMarks: '',
      maxSubmissions: ''
    });
  };

  const handleAssignmentAction = (action: string, assignment?: Assignment) => {
    switch (action) {
      case 'add':
        resetAssignmentForm();
        setIsEditMode(false);
        setShowAssignmentForm(true);
        setSelectedAssignment(null);
        break;
      case 'edit':
        if (assignment) {
          setAssignmentForm({
            title: assignment.title,
            description: assignment.description,
            subject: assignment.subject,
            dueDate: assignment.dueDate,
            dueTime: assignment.dueTime,
            totalMarks: assignment.totalMarks.toString(),
            maxSubmissions: assignment.maxSubmissions?.toString() || ''
          });
          setSelectedAssignment(assignment);
          setIsEditMode(true);
          setShowAssignmentForm(true);
        }
        break;
      case 'delete':
        if (assignment && window.confirm('Are you sure you want to delete this assignment?')) {
          // setAssignments(assignments.filter(a => a.id !== assignment.id)); // This line was removed as per new_code
        }
        break;
      case 'view':
        setSelectedAssignment(assignment || null);
        break;
      case 'submissions':
        setSelectedAssignment(assignment || null);
        setShowSubmissions(true);
        break;
      case 'cancel':
        setShowAssignmentForm(false);
        setShowSubmissions(false);
        setSelectedAssignment(null);
        setIsEditMode(false);
        resetAssignmentForm();
        break;
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!assignmentForm.title || !assignmentForm.description || !assignmentForm.subject || !assignmentForm.dueDate || !assignmentForm.dueTime) {
      alert('Please fill in all required fields');
      return;
    }

    const currentDate = new Date();
    const dueDate = new Date(`${assignmentForm.dueDate}T${assignmentForm.dueTime}`);
    
    let assignmentStatus: 'live' | 'completed' | 'overdue';
    if (dueDate > currentDate) {
      assignmentStatus = 'live';
    } else {
      assignmentStatus = 'overdue';
    }

    if (isEditMode && selectedAssignment) {
      const updatedAssignment: Assignment = {
        ...selectedAssignment,
        title: assignmentForm.title,
        description: assignmentForm.description,
        subject: assignmentForm.subject,
        dueDate: assignmentForm.dueDate,
        dueTime: assignmentForm.dueTime,
        totalMarks: parseInt(assignmentForm.totalMarks),
        maxSubmissions: assignmentForm.maxSubmissions ? parseInt(assignmentForm.maxSubmissions) : undefined,
        status: assignmentStatus
      };

      // setAssignments(assignments.map(a => a.id === selectedAssignment.id ? updatedAssignment : a)); // This line was removed as per new_code
    } else {
      const newAssignment: Assignment = {
        id: Math.max(...assignments.map(a => a.id)) + 1,
        title: assignmentForm.title,
        description: assignmentForm.description,
        subject: assignmentForm.subject,
        dueDate: assignmentForm.dueDate,
        dueTime: assignmentForm.dueTime,
        status: assignmentStatus,
        totalMarks: parseInt(assignmentForm.totalMarks),
        submissions: 0,
        maxSubmissions: assignmentForm.maxSubmissions ? parseInt(assignmentForm.maxSubmissions) : undefined,
        createdBy: 'Current Admin',
        createdDate: new Date().toISOString().split('T')[0]
      };

      // setAssignments([...assignments, newAssignment]); // This line was removed as per new_code
    }

    handleAssignmentAction('cancel');
  };

  const handleInputChange = (field: keyof AssignmentFormData, value: string) => {
    setAssignmentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const AssignmentCard: React.FC<{ assignment: Assignment; showActions?: boolean }> = ({ assignment, showActions = false }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-lg">{assignment.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{assignment.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BookOpen size={16} />
          <span>{assignment.subject}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>{formatTime(assignment.dueTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User size={16} />
          <span>
            {assignment.submissions || 0} submissions
            {assignment.maxSubmissions && ` / ${assignment.maxSubmissions} max`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle size={16} />
          <span>Total Marks: {assignment.totalMarks}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        {userType === 'student' && assignment.status === 'live' && (
          <label className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm cursor-pointer hover:bg-blue-700 transition-colors">
            <Upload size={14} />
            Submit
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUpload(e, assignment.id)}
              className="hidden"
            />
          </label>
        )}
        
        {userType === 'admin' && showActions && (
          <>
            <button
              onClick={() => handleAssignmentAction('submissions', assignment)}
              className="flex items-center gap-1 px-3 py-1 text-purple-600 hover:bg-purple-50 rounded text-sm"
            >
              <Eye size={14} />
              Submissions
            </button>
            <button
              onClick={() => handleAssignmentAction('edit', assignment)}
              className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm"
            >
              <Edit size={14} />
              Edit
            </button>
            <button
              onClick={() => handleAssignmentAction('delete', assignment)}
              className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </>
        )}
        
        {userType === 'student' && (
          <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded text-sm">
            <Eye size={14} />
            View Details
          </button>
        )}
      </div>
    </div>
  );

  // Assignment Form Modal
  const AssignmentFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>
          <button
            onClick={() => handleAssignmentAction('cancel')}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              value={assignmentForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={assignmentForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter assignment description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={assignmentForm.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks *
              </label>
              <input
                type="number"
                value={assignmentForm.totalMarks}
                onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter total marks"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={assignmentForm.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Time *
              </label>
              <input
                type="time"
                value={assignmentForm.dueTime}
                onChange={(e) => handleInputChange('dueTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Submissions
            </label>
            <input
              type="number"
              value={assignmentForm.maxSubmissions}
              onChange={(e) => handleInputChange('maxSubmissions', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter max submissions (optional)"
              min="1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => handleAssignmentAction('cancel')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              {isEditMode ? 'Update Assignment' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Submissions Modal
  const SubmissionsModal = () => {
    const assignmentSubmissions = submissions.filter(sub => sub.assignmentId === selectedAssignment?.id);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Submissions for: {selectedAssignment?.title}
            </h2>
            <button
              onClick={() => handleAssignmentAction('cancel')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {assignmentSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignmentSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{submission.studentName}</div>
                            <div className="text-sm text-gray-500">{submission.studentId}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(submission.submissionDate).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-500">{submission.submissionTime}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" />
                            {submission.fileName}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(submission.status)}`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {submission.marks ? `${submission.marks}/${selectedAssignment?.totalMarks}` : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Download size={16} />
                            </button>
                            {userType === 'admin' && (
                              <button className="text-green-600 hover:text-green-800">
                                <Edit size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No submissions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-4xl font-bold text-slate-800 tracking-wide">
                ASSIGNMENT
              </h1>
            </div>
            
            {userType === 'admin' && (
              <button
                onClick={() => handleAssignmentAction('add')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Create Assignment
              </button>
            )}
          </div>
        </div>

        {/* Assignment Sections */}
        <div className="space-y-6">
          {/* Live Assignments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">LIVE ASSIGNMENTS</h2>
            {liveAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} showActions={true} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No live assignments at the moment</p>
              </div>
            )}
          </div>

          {/* Completed and Overdue Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assignments Completed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">ASSIGNMENTS COMPLETED</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {completedAssignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} showActions={userType === 'admin'} />
                ))}
              </div>
            </div>

            {/* Pending Works (Overdue) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">PENDING WORKS</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {overdueAssignments.length > 0 ? (
                  overdueAssignments.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} showActions={userType === 'admin'} />
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                    <p className="text-gray-500">No pending assignments!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload and View Buttons for Students */}
          {userType === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assignment Upload */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">ASSIGNMENT UPLOAD</h3>
                  <p className="text-gray-600 mb-4">Upload your completed assignments</p>
                  
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <Upload size={16} />
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* View Assignment */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Eye className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">VIEW ASSIGNMENT</h3>
                  <p className="text-gray-600 mb-4">View your submitted assignments and grades</p>
                  
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Eye size={16} />
                    View Submissions
                  </button>
                </div>
              </div>
            </div>
          )}

          {uploadStatus && (
            <div className={`p-4 rounded-lg ${
              uploadStatus.includes('successfully') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <button className="w-3 h-3 rounded-full bg-slate-700"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
        </div>

        {/* Modals */}
        {showAssignmentForm && <AssignmentFormModal />}
        {showSubmissions && <SubmissionsModal />}
      </div>
    </div>
  );
};

export default AssignmentPage;