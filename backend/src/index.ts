import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request } from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import getUserFromToken  from "./utils/auth";
import initSocket from "./socket";

const app: Application = express();
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

app.use(cors());

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server" });
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Request }) => {
      const user = getUserFromToken(req);
      return { user, io };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
