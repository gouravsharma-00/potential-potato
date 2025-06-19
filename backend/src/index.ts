// src/index.ts
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers, setSocketIoInstance } from './resolvers';
import { createContext } from './context';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});

// Create a separate HTTP server for Socket.io
const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST'],
  },
});

setSocketIoInstance(io); // Pass Socket.io instance to resolvers

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinEventRoom', (eventId: string) => {
    socket.join(eventId);
    console.log(`Socket ${socket.id} joined room ${eventId}`);
  });

  socket.on('leaveEventRoom', (eventId: string) => {
    socket.leave(eventId);
    console.log(`Socket ${socket.id} left room ${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 GraphQL server ready at ${url}`);
  httpServer.listen(4001, () => {
    console.log('⚡ Socket.io server ready at http://localhost:4001');
  });
});