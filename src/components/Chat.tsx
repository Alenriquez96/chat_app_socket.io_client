import { useState, useEffect } from "react";

type MessageContent = {
  author: string;
  message: string;
  time: string;
};

const Chat = ({ socket, user, room, disconnect }: any) => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<MessageContent[]>([]);

  const sendMessage = async (e: any) => {
    e.preventDefault();
    if (currentMessage.length) {
      const messageData = {
        room: room,
        author: user,
        message: currentMessage,
        time: new Date().toISOString().split("T")[1].slice(0, 5),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list: MessageContent[]) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  const handleDisconnect = async () => {
    socket.close();
    disconnect();
  };

  useEffect(() => {
    socket.on("receive_message", (data: MessageContent) => {
      setMessageList((list: MessageContent[]) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center  sm:w-[500px] w-[340px]  bg-slate-900  rounded-lg">
      <div className="flex items-center w-full bg-slate-600 rounded-t-lg justify-between h-[45px]">
        <div className="flex items-center mx-5">
          <h1>Live Chat</h1>
          <div className="rounded-[50%] bg-green-500 h-2 w-2 mx-2"></div>
        </div>
        <p>Room: {room}</p>
        <svg
          onClick={handleDisconnect}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mx-5 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </div>
      <section className="w-full flex flex-col justify-end min-h-[500px]">
        {messageList.map((messageContent: MessageContent, i: number) => {
          return (
            <div
              key={i}
              id={user === messageContent.author ? "you" : "other"}
              className={` flex flex-col ${
                user === messageContent.author ? "items-end" : "items-start"
              }`}
            >
              <div className="mx-4 my-2">
                <div
                  className={`${
                    messageContent.author === user
                      ? "bg-blue-400 text-white"
                      : "bg-slate-800 text-white"
                  }   rounded-[30px] h-[40px] grid place-content-center px-5`}
                >
                  <p>{messageContent.message}</p>
                </div>
                <div className="flex items-center justify-between text-[12px] mt-1">
                  <p className="mx-1" id="time">
                    {messageContent.time}
                  </p>
                  <p id="author">
                    {messageContent.author === user
                      ? "You"
                      : messageContent.author}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <form
        onSubmit={sendMessage}
        className="w-full relative flex items-center justify-center mb-2"
      >
        <input
          type="text"
          className="  my-2 rounded-[30px] h-[50px] w-[90%] bg-transparent border-gray-400 border-[0.5px] pl-4"
          value={currentMessage}
          placeholder="Type something..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button className="absolute right-9 w-[25px] h-full" type="submit">
          &#9658;
        </button>
      </form>
    </div>
  );
};

export default Chat;
