# Vaishnav Edutech - Technical Documentation

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Linting**: ESLint 9.9.1

### Application Structure
```
App.tsx (Router)
├── LoginPage.tsx (Authentication)
├── StudentDashboard.tsx (Student Interface)
│   ├── AttendancePage.tsx
│   ├── EventsPage.tsx
│   └── AssignmentPage.tsx
└── AdminDashboard.tsx (Admin Interface)
    ├── EventsPage.tsx
    └── AssignmentPage.tsx
```

## 📊 Core Data Models

### Student Profile
```typescript
interface StudentProfile {
  id: string;
  name: string;
  class: string;
  academicHistory: AcademicRecord[];
  extracurriculars: Activity[];
  certificates: Certificate[];
  ciaExams: ExamRecord[];
}
```

### Attendance System
```typescript
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
```

### Assignment Management
```typescript
interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: 'live' | 'completed' | 'overdue';
  totalMarks: number;
  submissions?: number;
}
```

## 🔧 Implementation Patterns

### State Management
```typescript
// Local state with React Hooks
const [currentUser, setCurrentUser] = useState<UserType>(null);
const [currentView, setCurrentView] = useState<'dashboard' | 'attendance' | 'events' | 'assignments'>('dashboard');
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
```

### Component Communication
```typescript
// Props-based communication
<AttendancePage 
  onBack={handleBackToDashboard} 
  attendanceStats={attendanceStats} 
  recentAttendance={recentAttendance} 
/>

// Event handlers
const handleLogin = (userType: UserType) => {
  setCurrentUser(userType);
};
```

### Conditional Rendering
```typescript
// Role-based rendering
{userType === 'admin' && (
  <button onClick={() => handleEventAction('add')}>
    Add Event
  </button>
)}

// Status-based rendering
{assignment.status === 'live' && (
  <label className="submit-button">
    Submit
    <input type="file" onChange={handleFileUpload} />
  </label>
)}
```

## 🤖 AI Integration

### Gemini AI Implementation
```typescript
async function getGeminiAIResponse(userMessage: string, contextData: any): Promise<string> {
  const prompt = getRelevantPromptData(userMessage, contextData);
  
  try {
    const response = await fetch('http://localhost:3001/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return getBotResponse(userMessage, contextData, studentProfile);
  }
}
```

### Context-Aware Responses
```typescript
function getBotResponse(userMessage: string, contextData: any, studentProfile: any): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('mark') || msg.includes('grade')) {
    return formatGradeResponse(studentProfile);
  } else if (msg.includes('attendance')) {
    return formatAttendanceResponse(contextData);
  }
  
  return 'I am here to help you with your school activities!';
}
```

## 🎨 UI/UX Implementation

### Design System
```typescript
// Status color system
const getStatusColor = (status: string) => {
  switch (status) {
    case 'present': return 'text-green-600 bg-green-100';
    case 'absent': return 'text-red-600 bg-red-100';
    case 'late': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Card component pattern
const CardComponent = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);
```

### Responsive Design
```typescript
// Grid system
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <CardComponent key={item.id}>
      {/* Card content */}
    </CardComponent>
  ))}
</div>
```

## 🔒 Security Features

### Authentication
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  const user = mockUsers[username as keyof typeof mockUsers];
  
  if (user && user.password === password) {
    onLogin(user.type);
  } else {
    setError('Invalid username or password');
  }
  
  setIsLoading(false);
};
```

### Input Validation
```typescript
const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!eventForm.title || !eventForm.description || !eventForm.date) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Process form submission
};
```

### File Upload Security
```typescript
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setError('Invalid file type. Please upload a valid file.');
      return;
    }
    
    // Process file upload
  }
};
```

## 📁 File Organization

### Component Structure
```
src/components/
├── LoginPage.tsx           # Authentication
├── StudentDashboard.tsx    # Student interface
├── AdminDashboard.tsx      # Admin interface
├── AttendancePage.tsx      # Attendance management
├── EventsPage.tsx          # Events & certificates
└── AssignmentPage.tsx      # Assignment management
```

### Import Organization
```typescript
// External libraries
import React, { useState } from 'react';
import { Eye, EyeOff, Flame } from 'lucide-react';

// Internal components
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';

// Types and interfaces
interface LoginPageProps {
  onLogin: (userType: 'student' | 'admin') => void;
}
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy loading for large components
const AttendancePage = React.lazy(() => import('./components/AttendancePage'));

// Suspense wrapper
<Suspense fallback={<div>Loading...</div>}>
  {currentView === 'attendance' && <AttendancePage {...props} />}
</Suspense>
```

### State Optimization
```typescript
// Batch state updates
const handleMultipleUpdates = () => {
  setCurrentView('dashboard');
  setActiveSection(null);
  setChatMessages([]);
};

// Functional updates for dependent state
setChatMessages(prev => [...prev, newMessage]);
```

## 🧪 Testing Strategy

### Component Testing
```typescript
describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage onLogin={mockOnLogin} />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    render(<LoginPage onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'student' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'student123' }
    });
    fireEvent.click(screen.getByText('LOGIN'));
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('student');
    });
  });
});
```

## 🔧 Build Configuration

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
```

## 📊 Data Flow

### State Management Flow
```
User Action → Component Handler → State Update → Re-render → UI Update
     ↓
API Call → Response Processing → State Update → UI Update
     ↓
Form Submission → Validation → State Update → Navigation
```

### Component Communication Flow
```
App (Router)
├── LoginPage → App (setCurrentUser)
├── StudentDashboard → App (onLogout)
│   ├── AttendancePage → StudentDashboard (onBack)
│   ├── EventsPage → StudentDashboard (onBack)
│   └── AssignmentPage → StudentDashboard (onBack)
└── AdminDashboard → App (onLogout)
    ├── EventsPage → AdminDashboard (onBack)
    └── AssignmentPage → AdminDashboard (onBack)
```

## 🔮 Future Enhancements

### Planned Architecture Improvements
- **State Management**: Redux or Zustand for complex state
- **API Integration**: Backend API development
- **Real-time Updates**: WebSocket integration
- **Testing**: Unit and integration tests
- **Performance**: Code splitting and optimization
- **Accessibility**: WCAG compliance improvements

### Technical Roadmap
- **Database Integration**: Replace mock data with real database
- **Authentication**: Implement proper authentication system
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed reporting and analytics
- **Notification System**: Push notifications for important events

---

This technical documentation provides a comprehensive overview of the Vaishnav Edutech system architecture, implementation patterns, and development strategies. 