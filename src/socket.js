import { io } from "socket.io-client";
console.log(localStorage.getItem("token"));

 const socket = io("wss://backend-production-574a.up.railway.app", {
  query: {
    token: localStorage.getItem("token"), // or from cookies, depending on where you store it
  },
  reconnectionAttempts: 5, 
  reconnectionDelay: 3000, 
});

export default socket