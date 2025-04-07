import { io } from "socket.io-client";

const socket = io("https://backend-production-574a.up.railway.app", {
  query: {
    token: `${localStorage.getItem("token")}`
  },
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});
console.log(socket);


export default socket