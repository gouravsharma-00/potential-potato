import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  Query: {
    events: () => prisma.event.findMany({ include: { attendees: true } }),
    me: async (_ : any, __ : any, { user }) => {
      if (!user) throw new Error("Not Authenticated");
      return prisma.user.findUnique({ where: { id: user.id } });
    },
  },

  Mutation: {
    joinEvent: async (_, { eventId }, { user, io }) => {
      if (!user) throw new Error("Not Authenticated");

      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          attendees: { connect: { id: user.id } },
        },
        include: { attendees: true },
      });

      io.emit("userJoined", { eventId, user });

      return event;
    },
  },
};
