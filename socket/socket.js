const socketIO = require("socket.io");
const userEvent = require("./events/userEvent");
const messEvent = require("./events/messEvent");

const activeUsers = {};

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  });

  // SocketIO
  io.on("connection", (socket) => {
    console.log("a user connected");

    userEvent(io, socket, activeUsers);
    messEvent(io, socket, activeUsers);

    socket.on("disconnect", () => {
      for (let username in activeUsers) {
        if (activeUsers[username] === socket) {
          delete activeUsers[username];
          console.log(`${username} is offline`);
          break;
        }
      }
    });
  });
};
