import { Server } from 'socket.io'
let io = null;

export default function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}

