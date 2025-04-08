import React, { useEffect, useState } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

const App = () => {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onmessage = (event) => {
      const { status } = JSON.parse(event.data);
      setStatus(status);
    };

    return () => socket.close();
  }, []);

  const sendAction = (action) => {
    if (ws) {
      ws.send(JSON.stringify({ action }));
    }
  };

  const isPlaying = status === "playing";

  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="bg-black w-[375px] h-[750px] rounded-[60px]">
        <h1 className="text-center font-semibold text-white mt-12 text-lg">
          Monday, April 7
        </h1>
        <h2 className="text-center text-7xl font-bold text-white">12:11</h2>
        <div className="bg-gray-700/55 mt-90 mx-4 rounded-4xl pt-16 pb-8">
          <div className="flex justify-center mt-12 gap-12">
            <button onClick={() => sendAction("backward")}>
              <FaBackward className="text-3xl text-white" />
            </button>
            {isPlaying ? (
              <button onClick={() => sendAction("pause")}>
                <FaPause className="text-3xl text-white" />
              </button>
            ) : (
              <button onClick={() => sendAction("play")}>
                <FaPlay className="text-3xl text-white" />
              </button>
            )}
            <button onClick={() => sendAction("forward")}>
              <FaForward className="text-3xl text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
