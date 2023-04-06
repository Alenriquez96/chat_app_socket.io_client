import { io } from "socket.io-client";
import Chat from "../components/Chat";
import { useState, useEffect } from "react";

const url = () =>
  document.domain === "localhost"
    ? "http://localhost:3001"
    : "https://chatappserver-dqt3.onrender.com";

const socket = io(url());

function App() {
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [usersConnected, setUsersConnected] = useState(0);

  const handleJoinRoom = (event: any) => {
    event.preventDefault();
    if (room !== null && user.length) {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  useEffect(() => {
    socket.on("user_count", (data: number) => setUsersConnected(data));
  }, [socket]);

  const handleSetUserAndRoom = () => {
    setUser("");
    setRoom(null);
    setShowChat(false);
  };

  return (
    <div className="App min-h-screen bg-black text-gray-400 flex justify-center  items-center">
      {!showChat ? (
        <form
          onSubmit={handleJoinRoom}
          className="flex flex-col items-center justify-center sm:w-[500px] w-[340px]  bg-slate-900  rounded-lg"
        >
          <h2 className="h-[45px] py-2 pl-4 text-lg bg-slate-600 rounded-t-lg w-full">
            Join a Room
          </h2>
          <div className="h-[400px] w-full flex flex-col items-center justify-center">
            <p>Users connected: {usersConnected}</p>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUser(e.target.value)}
              className="my-2 rounded-[30px]  h-[50px] w-[60%] bg-transparent border-gray-400 border-[0.5px] pl-4"
            />
            <input
              className="my-2 rounded-[30px] h-[50px] w-[60%] bg-transparent border-gray-400 border-[0.5px] pl-4"
              type="text"
              placeholder="Room"
              onChange={(e: any) => setRoom(e.target.value)}
            />
            <input
              className="my-2 rounded-[30px] h-[50px] w-[60%] bg-gray-400 text-[black] hover:bg-gray-700 hover:text-white cursor-pointer border-gray-400 border-[0.5px] pl-3"
              type="submit"
            />
          </div>
        </form>
      ) : (
        <Chat
          socket={socket}
          room={room}
          user={user}
          disconnect={handleSetUserAndRoom}
        />
      )}
    </div>
  );
}

export default App;
