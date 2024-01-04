'use client'
import React, { useState, useRef } from "react";

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const handleMessageSend = async () => {
        console.log('HANDELE MESSAGE SEND');
        setLoading(true);
        if (inputText.trim() !== "") {
            setMessages([
                ...messages,
                { text: inputText, author: "You" }, // Add user's message

            ]);
            setInputText(""); // Clear the input field
            console.log(messages);

            try {
                const response = await fetch("/api/users/chat/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        key: "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",
                        chatModel: "gpt-3.5-turbo",
                        PROMPT: inputText,
                        a: JSON.stringify(messages.filter((message) => message.author === "AI")),
                        u: JSON.stringify(messages.filter((message) => message.author === "You")),
                        previous_messages: JSON.stringify(messages),
                    }),
                });

                const data = await response.json();
                setLoading(false);
                console.log(data, messages);
                setMessages([
                    ...messages,
                    { text: inputText, author: "You" }, // Add user's message
                    { text: data.response, author: "AI" } // Add AI's reply
                ]);

                console.log(messages);
                if (messageContainerRef.current) {
                    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
                }
                if (data.response === undefined) {
                    alert('Error in server')
                }
                // const botReply: Message = { text: data.response, author: "AI" };
                // setMessages([...messages, botReply]);

            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center ">
            <div className="max-w-4xl w-full bg-white p-4 rounded-lg shadow-md ">
                <h1 className="text-blue-400">{loading ? 'Loading...' : 'Chat Bot'} </h1>
                <div className="h-96  overflow-y-auto" ref={messageContainerRef}>
                    {messages.map((message, index) => (
                        <div
                            key={`${message.author}-${Math.random()}`} // Unique key based on author and index
                            className={`mb-2 p-2 rounded-md ${message.author === "You"
                                ? "bg-blue-100 text-blue-800 self-end "
                                : "bg-green-100 text-green-700  self-start "
                                }`}

                        >
                            {message.text}
                        </div>
                    ))}


                </div>
                <div className="mt-2 flex flex-col sm:flex-row">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-1 border rounded-md py-2 px-3 text-black mb-2 sm:mb-0 sm:mr-2"
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleMessageSend();
                            }
                        }}
                    />
                    <button
                        className="bg-blue-500 text-white rounded-md px-4 py-2 w-full sm:w-auto"
                        onClick={handleMessageSend}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

interface Message {
    text: string;
    author: string;
}
