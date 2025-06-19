// src/state/eventStore.ts
import { create } from 'zustand';

// Define the shape of an Event
interface Event {
  id: string;
  name: string;
  location: string;
  startTime: string; // ISO string
  attendees: Array<{ id: string; name: string; email: string }>;
}

// Define the state structure for the event store
interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  setEvents: (events: Event[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  // Potentially add more actions like:
  // updateEventAttendees: (eventId: string, newAttendees: Array<{ id: string; name: string; email: string }>) => void;
}

/**
 * Zustand store for managing local event-related state.
 * While TanStack Query handles most data fetching and caching,
 * this store can be used for UI-specific state or global event data
 * that doesn't strictly come from a GraphQL query but might be derived or cached.
 */
export const useEventStore = create<EventState>((set) => ({
  events: [], // Initial empty array of events
  selectedEvent: null, // No event selected initially

  /**
   * Action to set the entire list of events.
   * @param events - An array of Event objects.
   */
  setEvents: (events: Event[]) => set({ events }),

  /**
   * Action to set the currently selected event.
   * Useful for navigation or displaying details without re-fetching if data is already available.
   * @param event - The selected Event object or null if no event is selected.
   */
  setSelectedEvent: (event: Event | null) => set({ selectedEvent: event }),

  // Example of how you might update attendees if not relying solely on Socket.io and TanStack Query refetching:
  // updateEventAttendees: (eventId: string, newAttendees: Array<{ id: string; name: string; email: string }>) =>
  //   set((state) => ({
  //     events: state.events.map((event) =>
  //       event.id === eventId ? { ...event, attendees: newAttendees } : event
  //     ),
  //     selectedEvent: state.selectedEvent?.id === eventId
  //       ? { ...state.selectedEvent, attendees: newAttendees }
  //       : state.selectedEvent,
  //   })),
}));
