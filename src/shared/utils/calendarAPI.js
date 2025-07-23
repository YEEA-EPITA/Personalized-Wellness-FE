import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_NODE_URL;

class CalendarAPI {
  // Get all events
  static async getEvents() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get events by date range
  static async getEventsByDateRange(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      throw error;
    }
  }

  // Create a new event
  static async createEvent(eventData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update an existing event
  static async updateEvent(eventId, eventData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete an event
  static async deleteEvent(eventId) {
    try {
      await axios.delete(`${API_BASE_URL}/api/events/${eventId}`);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Get events by user ID (if you have user-specific events)
  static async getUserEvents(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  }

  // Bulk create events
  static async bulkCreateEvents(eventsArray) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/events/bulk`, {
        events: eventsArray
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk creating events:', error);
      throw error;
    }
  }
}

export default CalendarAPI;
