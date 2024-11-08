import Forms from './components/Forms';
//import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";
import './App.css';

import RoomPage from './pages/RoomPage';
import { useEffect, useState } from 'react';

const server = "http://localhost:5000";
const connectOptions = {
  "force new connection": true,
  reconnnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectOptions);

const App = () => {

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
        setUsers(data.users);
      } else {
        console.log("userJoined error");
      }
    });

    socket.on("allUsers", (data) => {
      setUsers(data);
    });


  socket.on("userJoinedMessageBroadcasted",(data)=>{
    console.log(`${data} joined the room`);
    toast.info(`${data} joined the room`);
  });
  socket.on("userLeftMessageBroadcasted",(data)=>{
    console.log(`${data} left the room`);
    toast.info(`${data} left the room`);
  });
},[]);


  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };
  return (
    <div className='container'>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route path="/:roomId"
          element={<RoomPage user={user} socket={socket} users={users} />} />
      </Routes>
    </div>
  );
};

export default App;
