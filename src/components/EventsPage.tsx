import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  Upload, 
  Download, 
  Edit, 
  Plus, 
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  Save
} from 'lucide-react';

interface EventsPageProps {
  onBack: () => void;
  userType: 'student' | 'admin';
  events: Event[];
  certificates: Certificate[];
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

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: string;
  status: 'open' | 'closed' | 'cancelled';
}

const EventsPage: React.FC<EventsPageProps> = ({ onBack, userType, events, certificates }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'certificates'>('events');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for adding/editing events
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    status: 'open'
  });

  const liveEvents = events.filter(event => event.type === 'live');
  const completedEvents = events.filter(event => event.type === 'completed');
  const upcomingEvents = events.filter(event => event.type === 'upcoming');

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCertificateStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'od' | 'certificate') => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadStatus(`${type === 'od' ? 'OD Form' : 'Certificate'} selected: ${file.name}`);
      
      setTimeout(() => {
        setUploadStatus(`${type === 'od' ? 'OD Form' : 'Certificate'} uploaded successfully!`);
        setTimeout(() => {
          setUploadStatus('');
        }, 3000);
      }, 1500);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: '',
      status: 'open'
    });
  };

  const handleEventAction = (action: string, event?: Event) => {
    switch (action) {
      case 'add':
        resetEventForm();
        setIsEditMode(false);
        setShowEventForm(true);
        setSelectedEvent(null);
        break;
      case 'edit':
        if (event) {
          setEventForm({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            maxParticipants: event.maxParticipants?.toString() || '',
            status: event.status
          });
          setSelectedEvent(event);
          setIsEditMode(true);
          setShowEventForm(true);
        }
        break;
      case 'delete':
        if (event && window.confirm('Are you sure you want to delete this event?')) {
          // This action would typically update the parent's events state
          // For now, we'll just remove it from the local list if it were mock data
          // In a real app, you'd call a prop function to update the parent's state
          // setEvents(events.filter(e => e.id !== event.id)); 
        }
        break;
      case 'view':
        setSelectedEvent(event || null);
        break;
      case 'cancel':
        setShowEventForm(false);
        setSelectedEvent(null);
        setIsEditMode(false);
        resetEventForm();
        break;
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.time || !eventForm.location) {
      alert('Please fill in all required fields');
      return;
    }

    const currentDate = new Date();
    const eventDate = new Date(eventForm.date);
    
    let eventType: 'live' | 'completed' | 'upcoming';
    if (eventDate.toDateString() === currentDate.toDateString()) {
      eventType = 'live';
    } else if (eventDate < currentDate) {
      eventType = 'completed';
    } else {
      eventType = 'upcoming';
    }

    if (isEditMode && selectedEvent) {
      // Update existing event
      const updatedEvent: Event = {
        ...selectedEvent,
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : undefined,
        status: eventForm.status,
        type: eventType
      };

      // This would typically update the parent's events state
      // setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e)); 
    } else {
      // Create new event
      const newEvent: Event = {
        id: Math.max(...events.map(e => e.id)) + 1,
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        type: eventType,
        participants: 0,
        maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : undefined,
        status: eventForm.status
      };

      // This would typically update the parent's events state
      // setEvents([...events, newEvent]); 
    }

    // Reset form and close modal
    handleEventAction('cancel');
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'open' | 'closed' | 'cancelled';
    handleInputChange('status', value);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const EventCard: React.FC<{ event: Event; showActions?: boolean }> = ({ event, showActions = false }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>{formatTime(event.time)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={16} />
          <span>
            {event.participants} participants
            {event.maxParticipants && ` / ${event.maxParticipants} max`}
          </span>
        </div>
      </div>

      {showActions && userType === 'admin' && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => handleEventAction('view', event)}
            className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
          >
            <Eye size={14} />
            View
          </button>
          <button
            onClick={() => handleEventAction('edit', event)}
            className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => handleEventAction('delete', event)}
            className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );

  // Event Form Modal
  const EventFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={() => handleEventAction('cancel')}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={eventForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={eventForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={eventForm.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                value={eventForm.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              value={eventForm.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event location"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                value={eventForm.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter max participants (optional)"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={eventForm.status}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => handleEventAction('cancel')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={16} />
              {isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

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
                EVENTS
              </h1>
            </div>
            
            {userType === 'admin' && (
              <button
                onClick={() => handleEventAction('add')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Event
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'events'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'certificates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Certificates
            </button>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Live Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">LIVE EVENTS</h2>
              {liveEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveEvents.map((event) => (
                    <EventCard key={event.id} event={event} showActions={true} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No live events at the moment</p>
                </div>
              )}
            </div>

            {/* Completed and Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Completed Events */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">COMPLETED</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {completedEvents.map((event) => (
                    <EventCard key={event.id} event={event} showActions={userType === 'admin'} />
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">UPCOMING</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} showActions={userType === 'admin'} />
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload OD Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">UPLOAD OD FORM</h3>
                  <p className="text-gray-600 mb-4">Upload On Duty forms for event participation</p>
                  
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                    <Upload size={16} />
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'od')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Upload Certificates */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Award className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">UPLOAD CERTIFICATES</h3>
                  <p className="text-gray-600 mb-4">
                    {userType === 'admin' ? 'Upload certificates for events' : 'Upload your achievement certificates'}
                  </p>
                  
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                    <Upload size={16} />
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'certificate')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

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
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {/* Certificates Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">CERTIFICATES</h2>
                {userType === 'admin' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Plus size={16} />
                    Generate Certificate
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <Award className="text-yellow-500" size={24} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificateStatusColor(certificate.status)}`}>
                        {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{certificate.eventTitle}</h4>
                    <p className="text-sm text-gray-600 mb-2">Student: {certificate.studentName}</p>
                    <p className="text-sm text-gray-600 mb-2">Type: {certificate.certificateType}</p>
                    {certificate.issueDate && (
                      <p className="text-sm text-gray-500 mb-3">
                        Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      {certificate.status === 'issued' && (
                        <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">
                          <Download size={14} />
                          Download
                        </button>
                      )}
                      {userType === 'admin' && (
                        <>
                          <button className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm">
                            <Edit size={14} />
                            Edit
                          </button>
                          {certificate.status === 'draft' && (
                            <button className="flex items-center gap-1 px-3 py-1 text-purple-600 hover:bg-purple-50 rounded text-sm">
                              <CheckCircle size={14} />
                              Issue
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Works Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">PENDING WORKS</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-orange-500" size={24} />
                  <h4 className="font-semibold text-gray-900">Certificate Processing Queue</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-sm text-gray-700">Science Fair 2024 - Achievement Certificates</span>
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Pending Review</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-sm text-gray-700">Sports Day - Participation Certificates</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">In Progress</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-sm text-gray-700">Cultural Festival - Excellence Awards</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Ready to Issue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <button className="w-3 h-3 rounded-full bg-slate-700"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
          <button className="w-3 h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors"></button>
        </div>

        {/* Event Form Modal */}
        {showEventForm && <EventFormModal />}
      </div>
    </div>
  );
};

export default EventsPage;