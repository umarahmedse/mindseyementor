import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http"; // Import http module
import { Server } from "socket.io"; // Import socket.io
import app from "../server/index.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  });

const port = process.env.PORT || 3000;
const server = http.createServer(app); // Create an http server

const io = new Server(server); // Create a socket.io instance

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
