import { useEffect, useState } from "react";

const Chat = ({ setOpenedChatTab, socket }) => {
    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Listening for incoming messages
        socket.on("messageResponse", (data) => {
            setChat((prevChats) => [...prevChats, data]);
        });

        // Clean up the socket listener on component unmount
        return () => {
            socket.off("messageResponse");
        };
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== "") {
            // Add the message to the chat state
            setChat((prevChats) => [...prevChats, { message, name: "You" }]);
            // Emit the message to the server
            socket.emit("message", { message });
            setMessage("");
        }
    };

    return (
        <div
            className="position-fixed top-0 h-100 text-white bg-dark"
            style={{ width: "400px", left: "0%" }}
        >
            <button
                type="button"
                onClick={() => setOpenedChatTab(false)}
                className="btn btn-light btn-block w-100 mt-5"
            >
                Close
            </button>

            <div
                className="w-100 mt-5 p-2 border border-1 border-white rounded-3"
                style={{ height: "70%", overflowY: "scroll" }}
            >
                {chat.map((msg, index) => (
                    <p key={index} className="my-2 text-center w-100 py-2 border-bottom">
                        {msg.name}: {msg.message}
                    </p>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="w-100 mt-4 d-flex rounded-3">
                <input
                    type="text"
                    placeholder="Enter message"
                    className="h-100 border-0 rounded-0 py-2 px-4"
                    style={{ width: "90%" }}
                    value={message}  
                    onChange={(e) => setMessage(e.target.value)}  
                />
                <button type="submit" className="btn btn-primary rounded-0">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
