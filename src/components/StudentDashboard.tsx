import React, { useState } from 'react';
import { ChevronDown, Send, User, Bot, LogOut } from 'lucide-react';
import AttendancePage from './AttendancePage';
import EventsPage from './EventsPage';
import AssignmentPage from './AssignmentPage';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
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

interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  status: 'live' | 'completed' | 'overdue';
  totalMarks: number;
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

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'live' | 'completed' | 'upcoming';
  participants: number;
  maxParticipants?: number;
  status: 'open' | 'closed' | 'cancelled';
}

interface Certificate {
  id: number;
  eventId: number;
  eventTitle: string;
  studentName: string;
  issueDate: string;
  certificateType: string;
  status: 'issued' | 'pending' | 'draft';
}

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLogout }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'attendance' | 'events' | 'assignments'>('dashboard');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      message: 'Hello! I\'m Vaishnav, your AI assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 5000)
    },
    {
      id: 2,
      sender: 'user',
      message: 'Can you help me with my assignments?',
      timestamp: new Date(Date.now() - 3000)
    },
    {
      id: 3,
      sender: 'bot',
      message: 'Of course! I can help you track your assignments, set reminders, and provide study tips. What specific assignment would you like help with?',
      timestamp: new Date(Date.now() - 1000)
    }
  ]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Attendance Data
  const [attendanceStats] = useState<AttendanceStats>({
    totalDays: 180,
    presentDays: 171,
    absentDays: 9,
    attendancePercentage: 95
  });
  const [recentAttendance] = useState<AttendanceRecord[]>([
    { id: 1, date: '2024-01-15', subject: 'Mathematics', status: 'present', time: '09:00 AM' },
    { id: 2, date: '2024-01-15', subject: 'Physics', status: 'present', time: '10:30 AM' },
    { id: 3, date: '2024-01-15', subject: 'Chemistry', status: 'late', time: '12:15 PM' },
    { id: 4, date: '2024-01-14', subject: 'English', status: 'present', time: '09:00 AM' },
    { id: 5, date: '2024-01-14', subject: 'History', status: 'absent', time: '11:00 AM' },
    { id: 6, date: '2024-01-14', subject: 'Biology', status: 'present', time: '02:00 PM' },
    { id: 7, date: '2024-01-13', subject: 'Mathematics', status: 'present', time: '09:00 AM' },
    { id: 8, date: '2024-01-13', subject: 'Physics', status: 'present', time: '10:30 AM' }
  ]);
  const [missedClasses] = useState<MissedClass[]>([
    { id: 1, date: '2024-01-14', subject: 'History', reason: 'Medical appointment', duration: '1 hour' },
    { id: 2, date: '2024-01-10', subject: 'Chemistry', reason: 'Family emergency', duration: '1 hour' },
    { id: 3, date: '2024-01-08', subject: 'English', reason: 'Sick leave', duration: '1 hour' },
    { id: 4, date: '2024-01-05', subject: 'Biology', reason: 'Transportation issue', duration: '1 hour' },
    { id: 5, date: '2024-01-03', subject: 'Mathematics', reason: 'Personal reasons', duration: '1 hour' }
  ]);

  // Assignment Data
  const [assignments] = useState<Assignment[]>([
    { id: 1, title: 'Mathematics Problem Set 1', description: 'Solve the given algebraic equations and show your working steps clearly.', subject: 'Mathematics', dueDate: '2024-02-20', dueTime: '23:59', status: 'live', totalMarks: 50, submissions: 25, maxSubmissions: 30, createdBy: 'Dr. Smith', createdDate: '2024-02-10' },
    { id: 2, title: 'Physics Lab Report', description: 'Write a comprehensive report on the pendulum experiment conducted in class.', subject: 'Physics', dueDate: '2024-02-25', dueTime: '17:00', status: 'live', totalMarks: 75, submissions: 18, maxSubmissions: 30, createdBy: 'Prof. Johnson', createdDate: '2024-02-12' },
    { id: 3, title: 'English Essay - Climate Change', description: 'Write a 1000-word essay on the impact of climate change on global ecosystems.', subject: 'English', dueDate: '2024-02-15', dueTime: '23:59', status: 'completed', totalMarks: 100, submissions: 28, maxSubmissions: 30, createdBy: 'Ms. Davis', createdDate: '2024-02-01' },
    { id: 4, title: 'Chemistry Molecular Structure', description: 'Draw and explain the molecular structures of given organic compounds.', subject: 'Chemistry', dueDate: '2024-02-10', dueTime: '15:00', status: 'overdue', totalMarks: 60, submissions: 22, maxSubmissions: 30, createdBy: 'Dr. Wilson', createdDate: '2024-01-28' },
    { id: 5, title: 'History Timeline Project', description: 'Create a detailed timeline of World War II events with analysis.', subject: 'History', dueDate: '2024-03-01', dueTime: '23:59', status: 'live', totalMarks: 80, submissions: 12, maxSubmissions: 30, createdBy: 'Mr. Brown', createdDate: '2024-02-14' }
  ]);
  const [submissions] = useState<Submission[]>([
    { id: 1, assignmentId: 1, studentName: 'John Doe', studentId: 'STU001', submissionDate: '2024-02-18', submissionTime: '14:30', fileName: 'math_assignment_john.pdf', status: 'graded', marks: 45, feedback: 'Excellent work! Clear explanations and correct solutions.' },
    { id: 2, assignmentId: 1, studentName: 'Jane Smith', studentId: 'STU002', submissionDate: '2024-02-19', submissionTime: '16:45', fileName: 'math_solutions_jane.pdf', status: 'graded', marks: 42, feedback: 'Good work, but some steps could be clearer.' },
    { id: 3, assignmentId: 2, studentName: 'Mike Johnson', studentId: 'STU003', submissionDate: '2024-02-20', submissionTime: '10:15', fileName: 'physics_lab_mike.docx', status: 'submitted', feedback: '' },
    { id: 4, assignmentId: 3, studentName: 'Sarah Wilson', studentId: 'STU004', submissionDate: '2024-02-14', submissionTime: '20:30', fileName: 'climate_essay_sarah.pdf', status: 'graded', marks: 88, feedback: 'Well-researched and well-written essay. Great analysis!' }
  ]);

  // Event Data
  const [events] = useState<Event[]>([
    { id: 1, title: 'Science Fair 2024', description: 'Annual science exhibition showcasing student projects and innovations.', date: '2024-02-15', time: '09:00', location: 'Main Auditorium', type: 'live', participants: 150, maxParticipants: 200, status: 'open' },
    { id: 2, title: 'Sports Day', description: 'Inter-house sports competition with various athletic events.', date: '2024-02-20', time: '08:00', location: 'Sports Ground', type: 'upcoming', participants: 89, maxParticipants: 300, status: 'open' },
    { id: 3, title: 'Cultural Festival', description: 'Celebration of arts, music, and cultural diversity.', date: '2024-01-30', time: '18:00', location: 'School Campus', type: 'completed', participants: 245, status: 'closed' },
    { id: 4, title: 'Math Olympiad', description: 'Regional mathematics competition for talented students.', date: '2024-02-25', time: '10:00', location: 'Computer Lab', type: 'upcoming', participants: 45, maxParticipants: 50, status: 'open' },
    { id: 5, title: 'Parent-Teacher Meeting', description: 'Quarterly meeting to discuss student progress.', date: '2024-01-25', time: '14:00', location: 'Classrooms', type: 'completed', participants: 180, status: 'closed' }
  ]);
  const [certificates] = useState<Certificate[]>([
    { id: 1, eventId: 3, eventTitle: 'Cultural Festival', studentName: 'John Doe', issueDate: '2024-02-01', certificateType: 'Participation', status: 'issued' },
    { id: 2, eventId: 3, eventTitle: 'Cultural Festival', studentName: 'Jane Smith', issueDate: '2024-02-01', certificateType: 'Excellence', status: 'issued' },
    { id: 3, eventId: 5, eventTitle: 'Parent-Teacher Meeting', studentName: 'Mike Johnson', issueDate: '2024-01-26', certificateType: 'Attendance', status: 'pending' },
    { id: 4, eventId: 1, eventTitle: 'Science Fair 2024', studentName: 'Sarah Wilson', issueDate: '', certificateType: 'Achievement', status: 'draft' }
  ]);

  // Add detailed John Doe profile data
  const johnDoeProfile = {
    id: 'STU001',
    name: 'John Doe',
    dob: '2007-05-14',
    gender: 'Male',
    class: '10-A',
    rollNumber: 12,
    email: 'john.doe@student.school.edu',
    phone: '+1-555-123-4567',
    address: {
      line1: '123 Main Street',
      line2: '',
      city: 'Springfield',
      state: 'Illinois',
      zip: '62704',
      country: 'USA'
    },
    guardian: {
      name: 'Jane Doe',
      relation: 'Mother',
      phone: '+1-555-987-6543',
      email: 'jane.doe@parentmail.com'
    },
    academicHistory: [
      { year: '2023', grade: 'A', remarks: 'Excellent performance in all subjects.' },
      { year: '2022', grade: 'A-', remarks: 'Strong in Math and Science, needs improvement in English.' },
      { year: '2021', grade: 'B+', remarks: 'Good overall, participated in Science Fair.' }
    ],
    extracurriculars: [
      { activity: 'Basketball Team', role: 'Player', years: '2022-2024' },
      { activity: 'Science Club', role: 'President', years: '2023-2024' },
      { activity: 'Math Olympiad', role: 'Participant', years: '2024' }
    ],
    certificates: [
      { title: 'Science Fair Winner', year: 2023 },
      { title: 'Math Olympiad Finalist', year: 2024 },
      { title: 'Perfect Attendance', year: 2022 }
    ],
    ciaExams: [
      {
        exam: 'CIA 1',
        year: 2024,
        marks: [
          { subject: 'Mathematics', score: 48, max: 50 },
          { subject: 'Physics', score: 44, max: 50 },
          { subject: 'Chemistry', score: 46, max: 50 },
          { subject: 'English', score: 42, max: 50 },
          { subject: 'History', score: 40, max: 50 }
        ]
      },
      {
        exam: 'CIA 2',
        year: 2024,
        marks: [
          { subject: 'Mathematics', score: 45, max: 50 },
          { subject: 'Physics', score: 47, max: 50 },
          { subject: 'Chemistry', score: 43, max: 50 },
          { subject: 'English', score: 41, max: 50 },
          { subject: 'History', score: 39, max: 50 }
        ]
      },
      {
        exam: 'CIA 3',
        year: 2024,
        marks: [
          { subject: 'Mathematics', score: 49, max: 50 },
          { subject: 'Physics', score: 46, max: 50 },
          { subject: 'Chemistry', score: 48, max: 50 },
          { subject: 'English', score: 44, max: 50 },
          { subject: 'History', score: 42, max: 50 }
        ]
      }
    ]
  };

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'];

  const mockBotResponses = [
    "I can help you with that! Let me check your current progress.",
    "Based on your academic performance, I recommend focusing on these areas.",
    "Great question! Here's what I found in your learning materials.",
    "Let me analyze your attendance and provide some insights.",
    "I've updated your assignment tracker. Is there anything specific you'd like to work on?",
    "Your discipline score is excellent! Keep up the good work.",
    "I can help you prepare for upcoming events and deadlines."
  ];

  // Add a function to format CIA exam marks for the prompt
  function formatCiaExamsForPrompt(exams: any[]) {
    return exams.map(exam =>
      `${exam.exam} (${exam.year}):\n` +
      exam.marks.map((m: any) => `  - ${m.subject}: ${m.score}/${m.max}`).join('\n')
    ).join('\n');
  }

  // Context-aware fallback bot response for any student
  function getBotResponse(userMessage: string, contextData: any, studentProfile: any): string {
    const msg = userMessage.toLowerCase();

    // Exam/marks/grade-related
    if (msg.includes('mark') || msg.includes('score') || msg.includes('grade') || msg.includes('result') || msg.includes('cia')) {
      // Exam-specific (e.g., CIA 1)
      const examMatch = msg.match(/cia\s*(\d)/);
      if (examMatch && studentProfile.ciaExams) {
        const examNum = `CIA ${examMatch[1]}`;
        const exam = studentProfile.ciaExams.find((e: any) => e.exam.toLowerCase() === examNum.toLowerCase());
        if (exam) {
          return `${exam.exam} (${exam.year}) marks:\n` +
            exam.marks.map((m: any) => `- ${m.subject}: ${m.score}/${m.max}`).join('\n');
        } else {
          return `No marks found for ${examNum}.`;
        }
      }
      // Subject-specific (e.g., Mathematics)
      const subjectMatch = msg.match(/(mathematics|math|physics|chemistry|english|history|biology)/i);
      if (subjectMatch && studentProfile.ciaExams) {
        const subject = subjectMatch[1].toLowerCase();
        let found = false;
        let subjectMarks = '';
        studentProfile.ciaExams.forEach((exam: any) => {
          const mark = exam.marks.find((m: any) => m.subject.toLowerCase().includes(subject));
          if (mark) {
            found = true;
            subjectMarks += `${exam.exam} (${exam.year}): ${mark.score}/${mark.max}\n`;
          }
        });
        if (found) {
          return `Your marks in ${subjectMatch[1]}:\n${subjectMarks.trim()}`;
        } else {
          return `No marks found for ${subjectMatch[1]}.`;
        }
      }
      // Overall grade history
      if (studentProfile.academicHistory) {
        return 'Your academic grade history:\n' +
          studentProfile.academicHistory.map((h: any) => `${h.year}: ${h.grade} (${h.remarks})`).join('\n');
      }
      return 'No marks or grade data found.';
    }
    // Attendance-related
    if (msg.includes('attendance') || msg.includes('absent') || msg.includes('present') || msg.includes('late')) {
      const { attendanceStats, recentAttendance } = contextData;
      return `Your attendance is ${attendanceStats.attendancePercentage}%. You have been present for ${attendanceStats.presentDays} out of ${attendanceStats.totalDays} days. Recent attendance: ` +
        recentAttendance.slice(0, 3).map((rec: any) => `${rec.date} - ${rec.subject}: ${rec.status}`).join('; ');
    }
    // Assignment-related
    if (msg.includes('assignment') || msg.includes('homework')) {
      const { assignments } = contextData;
      const pending = assignments.filter((a: any) => a.status === 'live' || a.status === 'overdue');
      if (pending.length === 0) return 'You have no pending assignments!';
      return `You have ${pending.length} pending assignments. Next due: ${pending[0].title} (Due: ${pending[0].dueDate}).`;
    }
    // Event-related
    if (msg.includes('event') || msg.includes('certificate')) {
      const { events } = contextData;
      const upcoming = events.filter((e: any) => e.type === 'upcoming' || e.type === 'live');
      if (upcoming.length === 0) return 'There are no upcoming events.';
      return `Upcoming events: ` + upcoming.map((e: any) => `${e.title} on ${e.date}`).join('; ');
    }
    // General fallback
    return 'I am here to help you with your school activities! You can ask about your marks, attendance, assignments, or upcoming events.';
  }

  // Helper to determine relevant data for the prompt
  function getRelevantPromptData(userMessage: string, contextData: any) {
    const msg = userMessage.toLowerCase();
    let prompt = `Student Data:\nProfile: ${JSON.stringify(johnDoeProfile)}\n`;
    if (msg.includes('cia')) {
      prompt += `CIA Exam Marks:\n${formatCiaExamsForPrompt(johnDoeProfile.ciaExams)}\n`;
    } else if (msg.includes('attendance') || msg.includes('absent') || msg.includes('present') || msg.includes('late')) {
      prompt += `Attendance: ${JSON.stringify(contextData.attendanceStats)}\nRecent Attendance: ${JSON.stringify(contextData.recentAttendance)}\n`;
    } else if (msg.includes('assignment')) {
      prompt += `Assignments: ${JSON.stringify(contextData.assignments)}\n`;
    } else if (msg.includes('event')) {
      prompt += `Events: ${JSON.stringify(contextData.events)}\n`;
    } else {
      // For general questions, just send profile
      prompt += '';
    }
    prompt += `\nUser question: "${userMessage}"\nAnswer the question using the data above. If the question is not about the data, answer as a helpful school assistant.`;
    return prompt;
  }

  // Improved Gemini AI integration with robust error handling
  async function getGeminiAIResponse(userMessage: string, contextData: any): Promise<string> {
    const prompt = getRelevantPromptData(userMessage, contextData);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 seconds

    try {
      const response = await fetch(
        'http://localhost:3001/api/gemini',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeout);

      // Check for HTTP errors
      if (!response.ok) {
        let errorMsg = `Gemini API error: ${response.status} ${response.statusText}`;
        setChatMessages(prev => [
          ...prev.slice(0, -1),
          {
            id: prev.length + 1,
            sender: 'bot',
            message: errorMsg,
            timestamp: new Date()
          }
        ]);
        return errorMsg;
      }

      const data = await response.json();

      // Check for expected response structure
      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0].text
      ) {
        return data.candidates[0].content.parts[0].text;
      } else {
        let errorMsg = 'Sorry, Gemini did not return a valid answer.';
        setChatMessages(prev => [
          ...prev.slice(0, -1),
          {
            id: prev.length + 1,
            sender: 'bot',
            message: errorMsg,
            timestamp: new Date()
          }
        ]);
        return errorMsg;
      }
    } catch (e) {
      let errorMsg = 'Sorry, there was an error connecting to Gemini.';
      if (e && typeof e === 'object' && 'name' in e && (e as any).name === 'AbortError') {
        errorMsg = 'Sorry, the AI is taking too long. Please try again.';
      }
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        {
          id: prev.length + 1,
          sender: 'bot',
          message: errorMsg,
          timestamp: new Date()
        }
      ]);
      return errorMsg;
    }
  }

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  // Update handleSendMessage to pass studentProfile
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        message: newMessage,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Show loading message
      const loadingMessage: ChatMessage = {
        id: chatMessages.length + 2,
        sender: 'bot',
        message: 'Thinking... (powered by Gemini AI)',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, loadingMessage]);

      // Try Gemini AI
      let botReply = await getGeminiAIResponse(userMessage.message, {
        attendanceStats,
        recentAttendance,
        assignments,
        events
      });
      // If Gemini fails, fallback to local logic
      if (!botReply || botReply.startsWith('Sorry')) {
        const fallback = getBotResponse(userMessage.message, {
          attendanceStats,
          recentAttendance,
          assignments,
          events
        }, johnDoeProfile); // <-- Replace with dynamic profile if available
        botReply = fallback || 'Sorry, I could not answer your question.';
      }
      // Replace loading message with real answer
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        {
          id: chatMessages.length + 2,
          sender: 'bot',
          message: botReply,
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleSectionClick = (section: string) => {
    if (section === 'ATTENDANCE') {
      setCurrentView('attendance');
    } else if (section === 'EVENTS') {
      setCurrentView('events');
    } else if (section === 'ASSIGNMENTS') {
      setCurrentView('assignments');
    } else {
      setActiveSection(activeSection === section ? null : section);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Show attendance page if selected
  if (currentView === 'attendance') {
    return <AttendancePage onBack={handleBackToDashboard} attendanceStats={attendanceStats} recentAttendance={recentAttendance} missedClasses={missedClasses} />;
  }

  // Show events page if selected
  if (currentView === 'events') {
    return <EventsPage onBack={handleBackToDashboard} userType="student" events={events} certificates={certificates} />;
  }

  // Show assignments page if selected
  if (currentView === 'assignments') {
    return <AssignmentPage onBack={handleBackToDashboard} userType="student" assignments={assignments} submissions={submissions} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-slate-800 tracking-wide">
              STUDENT DASHBOARD
            </h1>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Discipline Scorecard */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              DISCIPLINE SCORECARD:
            </h2>
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>{selectedLanguage}</span>
                <ChevronDown size={16} />
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {languages.map((language) => (
                    <button
                      key={language}
                      onClick={() => handleLanguageSelect(language)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-3xl font-bold">100</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Academic Grade */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            ACADEMIC GRADE
          </h2>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">A</span>
              </div>
              <p className="text-gray-500">Grade Chart Placeholder</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Chatbot */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              VAISHNAV CHATBOT
            </h2>
            
            <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 mb-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {['ATTENDANCE', 'ASSIGNMENTS', 'EVENTS', 'CLASS RECORDS'].map((section) => (
                <button
                  key={section}
                  onClick={() => handleSectionClick(section)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    activeSection === section
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <h3 className="text-lg font-semibold">{section}</h3>
                  {activeSection === section && section !== 'ATTENDANCE' && section !== 'EVENTS' && (
                    <p className="text-sm mt-2 text-gray-600">
                      {section === 'ASSIGNMENTS' && '3 assignments pending. Next due: Math homework (Tomorrow)'}
                      {section === 'CLASS RECORDS' && 'Recent grades: Math (A), Science (B+), English (A-)'}
                    </p>
                  )}
                  {section === 'ATTENDANCE' && (
                    <p className="text-sm mt-2 text-blue-600">
                      Click to view detailed attendance records →
                    </p>
                  )}
                  {section === 'EVENTS' && (
                    <p className="text-sm mt-2 text-blue-600">
                      Click to view events and certificates →
                    </p>
                  )}
                </button>
              ))}
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

export default StudentDashboard;