import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventService from '../../services/eventService';

// Initial state
const initialState = {
  events: [],
  myEvents: [],
  currentEvent: null,
  attendees: [],
  loading: false,
  error: null,
  searchResults: [],
  filters: {
    category: '',
    date: '',
    location: '',
    type: '', // online, in-person, hybrid
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
};

// Async Thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ page = 1, limit = 12, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents({ page, limit, ...filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchMyEvents = createAsyncThunk(
  'events/fetchMyEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getMyEvents();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventService.getEventById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event details');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await eventService.updateEvent(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

export const rsvpEvent = createAsyncThunk(
  'events/rsvpEvent',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await eventService.rsvpEvent(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to RSVP to event');
    }
  }
);

export const fetchEventAttendees = createAsyncThunk(
  'events/fetchEventAttendees',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventService.getEventAttendees(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendees');
    }
  }
);

export const searchEvents = createAsyncThunk(
  'events/searchEvents',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await eventService.searchEvents(searchQuery);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search events');
    }
  }
);

// Events Slice
const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
      state.attendees = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        date: '',
        location: '',
        type: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Events
      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.myEvents = action.payload;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Event By ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
        state.myEvents.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        const myIndex = state.myEvents.findIndex(e => e._id === action.payload._id);
        if (myIndex !== -1) {
          state.myEvents[myIndex] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(e => e._id !== action.payload.id);
        state.myEvents = state.myEvents.filter(e => e._id !== action.payload.id);
        if (state.currentEvent && state.currentEvent._id === action.payload.id) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RSVP Event
      .addCase(rsvpEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rsvpEvent.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEvent) {
          state.currentEvent.attendees = action.payload.attendees;
          state.currentEvent.userRSVP = action.payload.userRSVP;
        }
        // Update in myEvents if needed
        if (action.payload.userRSVP === 'going' && !state.myEvents.find(e => e._id === action.payload._id)) {
          state.myEvents.push(action.payload);
        } else if (action.payload.userRSVP === 'not_going') {
          state.myEvents = state.myEvents.filter(e => e._id !== action.payload._id);
        }
      })
      .addCase(rsvpEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Event Attendees
      .addCase(fetchEventAttendees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventAttendees.fulfilled, (state, action) => {
        state.loading = false;
        state.attendees = action.payload;
      })
      .addCase(fetchEventAttendees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Events
      .addCase(searchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, clearCurrentEvent, clearSearchResults, setFilters, clearFilters } = eventSlice.actions;

// Export selectors
export const selectEvents = (state) => state.events.events;
export const selectMyEvents = (state) => state.events.myEvents;
export const selectCurrentEvent = (state) => state.events.currentEvent;
export const selectEventAttendees = (state) => state.events.attendees;
export const selectEventLoading = (state) => state.events.loading;
export const selectEventError = (state) => state.events.error;
export const selectSearchResults = (state) => state.events.searchResults;
export const selectFilters = (state) => state.events.filters;
export const selectPagination = (state) => state.events.pagination;

// Export reducer
export default eventSlice.reducer;

