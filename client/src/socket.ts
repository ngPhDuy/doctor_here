import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

export const registerUser = (username: string) => {
  socket.emit("register", username);
};

export const sendMessage = (
  sender: string,
  receiver: string,
  content: string
) => {
  socket.emit("chat_message", { sender, receiver, content });
};

export const onMessageReceived = (callback: (message: string) => void) => {
  socket.on("chat_message", callback);
};

export default socket;
