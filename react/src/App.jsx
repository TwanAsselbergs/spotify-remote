import React, { useEffect, useState } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

const App = () => {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(new Date());
  const [albumCover, setAlbumCover] = useState("");
  const [artists, setArtists] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onmessage = (event) => {
      const { status, title, albumCover, artists } = JSON.parse(event.data);
      setStatus(status);
      setTitle(title);
      setAlbumCover(albumCover);
      setArtists(artists);
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
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
          {time.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <h2 className="text-center text-7xl font-bold text-white">
          {time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </h2>
        <img
          src={albumCover || "https://fakeimg.pl/600x400"}
          alt="Album Cover"
          className="w-66 h-66 bg-cover mx-auto rounded-4xl my-14"
        />
        <div className="bg-gray-700/55 mx-4 rounded-4xl pt-4 pb-6">
          <div className="flex flex-col items-center">
            <h3 className="text-center text-white text-xl font-medium mt-4 w-62 overflow-x-auto whitespace-nowrap">
              {title || "No song playing"}
            </h3>
            <p className="text-center text-gray-400 text-sm mt-2 w-62 overflow-x-auto whitespace-nowrap">
              {artists || "Unknown Artist"}
            </p>
          </div>
          <div className="flex justify-center mt-8 gap-12">
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
