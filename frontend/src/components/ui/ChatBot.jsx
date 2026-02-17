import { useState } from "react";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        setLoading(true);

        try {
            const response = await fetch("/api/chatbot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            const botMessage = {
                sender: "bot",
                text: data.reply,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Frontend Error:", error);
        }

        setInput("");
        setLoading(false);
    };

    return (
        <div>
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                        <p><strong>{msg.sender}:</strong> {msg.text}</p>
                    </div>
                ))}
                {loading && <p>Bot is typing...</p>}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
