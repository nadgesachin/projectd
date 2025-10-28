import mockApiService from '../mocks/mockApiService';

const eventService = {
  // Get all events with pagination and filters
  getEvents: async ({ page = 1, limit = 12, category = '', date = '', location = '', type = '' }) => {
    // Using mock API for now
    return mockApiService.getEvents({ page, limit, filters: { category, date, location, type } });
  },

  // Get events the user is attending or created
  getMyEvents: async () => {
    return mockApiService.getEvents({ page: 1, limit: 12 });
  },

  // Get a single event by ID
  getEventById: async (id) => {
    return mockApiService.getEventById(id);
  },

  // Create a new event
  createEvent: async (eventData) => {
    return mockApiService.createEvent(eventData);
  },

  // Update event details
  updateEvent: async (id, data) => {
    return mockApiService.updateEvent(id, data);
  },

  // Delete an event
  deleteEvent: async (id) => {
    return mockApiService.deleteEvent(id);
  },

  // RSVP to an event
  rsvpEvent: async (id, status) => {
    return mockApiService.rsvpEvent(id, status);
  },

  // Get event attendees
  getEventAttendees: async (id) => {
    return mockApiService.getEventById(id);
  },

  // Search events
  searchEvents: async (query) => {
    return mockApiService.getEvents({ page: 1, limit: 12, filters: { search: query } });
  },

  // Upload event image
  uploadEventImage: async (id, imageFile) => {
    return { data: { message: 'Image uploaded (mock)' } };
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    return mockApiService.getEvents({ page: 1, limit: 12 });
  },

  // Get past events
  getPastEvents: async () => {
    return { data: { events: [] } };
  },

  // Get events by location (nearby)
  getNearbyEvents: async (lat, lng, radius = 50) => {
    return mockApiService.getEvents({ page: 1, limit: 12 });
  },

  // Get events by category
  getEventsByCategory: async (category) => {
    return mockApiService.getEvents({ page: 1, limit: 12, filters: { category } });
  },

  // Get trending events
  getTrendingEvents: async () => {
    return mockApiService.getEvents({ page: 1, limit: 12 });
  },

  // Get recommended events based on user interests
  getRecommendedEvents: async () => {
    return mockApiService.getEvents({ page: 1, limit: 12 });
  },

  // Invite users to an event
  inviteToEvent: async (id, userIds) => {
    return { data: { message: 'Invitations sent (mock)' } };
  },

  // Cancel an event
  cancelEvent: async (id, reason) => {
    return mockApiService.deleteEvent(id);
  },

  // Check if event date/location is available
  checkAvailability: async (date, location) => {
    return { data: { available: true } };
  },

  // Export event to calendar (iCal format)
  exportToCalendar: async (id) => {
    return { data: {} };
  },
};

export default eventService;

