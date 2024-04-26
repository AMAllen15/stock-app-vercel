import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [room, setRoom] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setRoomMessages((prevRooms) => ({
        ...prevRooms,
        [message.room]: [...(prevRooms[message.room] || []), message],
      }));
    });

    socket.on("updateRooms", (availableRooms) => {
      setRooms(availableRooms);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateRooms");
    };
  }, []);

  const detectAndFormatURLs = (message) => {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return message.replace(urlRegex, (url) => {
      if (/\.(jpeg|jpg|gif|png)$/.test(url)) {
        return `<img src="${url}" alt="image" style="max-width:200px; max-height:200px;" />`;
      }
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  };

  const createRoom = () => {
    if (room) {
      socket.emit("createRoom", room);
      setRooms((prevRooms) => [...prevRooms, room]);
      setCurrentRoom(room);
      setRoomMessages((prev) => ({ ...prev, [room]: [] }));
      setRoom("");
    }
  };

  const deleteRoom = (roomName) => {
    socket.emit("deleteRoom", roomName);
    setRooms((prevRooms) => prevRooms.filter((r) => r !== roomName));
    setRoomMessages((prev) => {
      const updated = { ...prev };
      delete updated[roomName];
      return updated;
    });
    if (currentRoom === roomName) {
      setCurrentRoom("");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const messageData = {
          room: currentRoom,
          name: userName,
          message: `<img src="${e.target.result}" style="max-width:200px;">`,
          id: Date.now(),
        };
        socket.emit("sendMessage", messageData);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (chatMessage && userName && currentRoom) {
      const messageData = {
        room: currentRoom,
        name: userName,
        message: chatMessage,
        id: Date.now(),
      };
      socket.emit("sendMessage", messageData);
      setChatMessage("");
      setUserName("");
    }
  };

  return (
    <div className="chat-container">
      <input
        type="text"
        value={room}
        placeholder="New room name"
        onChange={(e) => setRoom(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? createRoom() : null)}
      />
      <button onClick={createRoom}>Create Room</button>
      <div className="room-list">
        {rooms.map((r) => (
          <div key={r}>
            {r}
            <button onClick={() => setCurrentRoom(r)}>Join</button>
            <button onClick={() => deleteRoom(r)}>Delete</button>
          </div>
        ))}
      </div>
      {currentRoom && (
        <>
          <h2>Room: {currentRoom}</h2>
          <div className="messages">
            {roomMessages[currentRoom] &&
              roomMessages[currentRoom].map((msg) => (
                <div key={msg.id}>
                  <strong>{msg.name}:</strong>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: detectAndFormatURLs(msg.message),
                    }}
                  />
                </div>
              ))}
          </div>
          <input
            type="text"
            value={userName}
            placeholder="Name/Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            value={chatMessage}
            placeholder="Enter a message or link!"
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
};

export default Chat;
