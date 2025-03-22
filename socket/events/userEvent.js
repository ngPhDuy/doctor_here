module.exports = (io, socket, activeUsers) => {
  socket.on("register", (username) => {
    activeUsers[username] = socket;
    console.log(`${username} is online`);
  });
};
