// src/resolvers.ts
import { IResolvers } from '@graphql-tools/utils';

import { Context } from './context';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer; // This will be set in index.ts

export const setSocketIoInstance = (socketIoInstance: SocketIOServer) => {
  io = socketIoInstance;
};

export const resolvers: IResolvers<any, Context> = {
  Query: {
    events: async (parent, args, context) => {
      return context.prisma.event.findMany({
        include: { attendees: true },
      });
    },
    me: async (parent, args, context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return context.prisma.user.findUnique({
        where: { id: context.userId },
        include: { events: true },
      });
    },
  },
  Mutation: {
    joinEvent: async (parent, { eventId }, context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      const user = await context.prisma.user.findUnique({
        where: { id: context.userId },
      });
      if (!user) {
        throw new Error('User not found');
      }

      const event = await context.prisma.event.findUnique({
        where: { id: eventId },
        include: { attendees: true },
      });
      if (!event) {
        throw new Error('Event not found');
      }

      // Check if user is already an attendee
      const isAlreadyAttendee = event.attendees.some(
        (attendee) => attendee.id === context.userId,
      );

      let updatedEvent;
      if (!isAlreadyAttendee) {
        updatedEvent = await context.prisma.event.update({
          where: { id: eventId },
          data: {
            attendees: {
              connect: { id: context.userId },
            },
          },
          include: { attendees: true },
        });

        // Emit real-time update via Socket.io
        if (io) {
          io.to(eventId).emit('attendeeUpdate', {
            eventId: updatedEvent.id,
            attendees: updatedEvent.attendees,
          });
          console.log(`Emitted attendeeUpdate for event ${eventId}`);
        }
      } else {
        // If already an attendee, just return the existing event
        updatedEvent = event;
      }

      return updatedEvent;
    },
  },
  Event: {
    startTime: (parent) => parent.startTime.toISOString(), // Format DateTime for GraphQL
  },
};