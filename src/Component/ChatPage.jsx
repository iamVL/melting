import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { socket } from "../App";
import "../ChatPage.css";

const ChatRoom = () => {
  const { roomId } = useParams();
  console.log("ChatPage mounted, roomId =", roomId);
  const { state } = useLocation();
  const friend = state?.friend ?? {};
  const friendId = friend?.id ?? null;
  const myId = sessionStorage.getItem("user");
  const token = sessionStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const LOCAL_KEY = `chatroom-${roomId}`; 

  // Load chat history from backend "posts" + local storage
    // Load chat history (and refetch whenever roomId changes)
    useEffect(() => {
      if (!myId) {
        navigate("/");
        return;
      }
  
      // clear out old messages
      setMessages([]);
  
      // fetch *all* posts, filter to just this room
      fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          // pull out only chat‐type posts
          const history = data
            .filter((post) => post.attributes.type === "chat")
            .map((post) => {
              try {
                return JSON.parse(post.attributes.content);
              } catch {
                return null;
              }
            })
            .filter((msg) => msg && msg.roomId === roomId);
  
          // grab any unsaved local messages
          const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  
          // merge without duplicates
          const combined = [...history];
          local.forEach((msg) => {
            const dup = combined.some(
              (m) =>
                m.ts === msg.ts &&
                m.sender === msg.sender &&
                m.text === msg.text
            );
            if (!dup) combined.push(msg);
          });
  
          setMessages(combined);
        })
        .catch(() => {
          // fallback if network fails
          const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
          setMessages(local);
        });
    }, [roomId, myId, navigate, token]);
  
  // Handle socket messages
  useEffect(() => {
    socket.emit("joinRoom", { roomId });

    const onReceive = (msg) => {
      if (+msg.roomId !== +roomId) return;

      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.ts === msg.ts && m.sender === msg.sender && m.text === msg.text
        );
        if (exists) return prev;

        const updated = [...prev, msg];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
    };

    socket.on("receiveMessage", onReceive);

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("receiveMessage", onReceive);
    };
  }, [roomId]);

  // Send message
  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
        roomId,
      sender: myId,
      to: friendId,
      text: text.trim(),
      ts: Date.now(),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setText("");
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));

    // Emit to socket
    socket.emit("sendMessage", newMsg);

    // Save to backend using POST /posts
    fetch(`${process.env.REACT_APP_API_PATH}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attributes: {
          type: "chat",
          content: JSON.stringify(newMsg),
          roomId,
        },
      }),
    }).catch((err) => {
      console.error("Failed to save message:", err);
    });
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="chat-room">
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        Chat with {friend.attributes?.username ?? "…"}
      </header>

      <ul className="messages">
        {messages.map((m, i) => (
          <li key={i} className={`message ${m.sender === myId ? "me" : "them"}`}>
            {m.text}
            <span className="ts">
              {new Date(m.ts || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </li>
        ))}
        <li ref={bottomRef} />
      </ul>

      <div className="input-bar">
        <input
          value={text}
          placeholder="Type a message…"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={!text.trim()}>Send</button>
      </div>
    </section>
  );
};

export default ChatRoom;
