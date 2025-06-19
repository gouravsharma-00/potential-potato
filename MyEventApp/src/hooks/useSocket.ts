// src/hooks/useSocket.ts
import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4001'; // Your Socket.io server endpoint

interface AttendeeUpdate {
  eventId: string;
  attendees: Array<{ id: string; name: string; email: string }>;
}

export const useSocket = (eventId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [attendees, setAttendees] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const latestAttendees = useRef(attendees);

  useEffect(() => {
    latestAttendees.current = attendees;
  }, [attendees]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.io connected');
      if (eventId) {
        newSocket.emit('joinEventRoom', eventId);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    newSocket.on('attendeeUpdate', (data: AttendeeUpdate) => {
      console.log('Attendee update received:', data);
      if (data.eventId === eventId) {
        setAttendees(data.attendees);
      }
    });

    return () => {
      if (eventId) {
        newSocket.emit('leaveEventRoom', eventId);
      }
      newSocket.disconnect();
    };
  }, [eventId]);

  return { socket, attendees };
};