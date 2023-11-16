// ChatRoom.tsx
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchMessages,
  sendMessage,
  deleteMessage,
} from "../../features/messagesSlice";
import { addParticipant } from "../../features/chatsSlice";
import { AppDispatch, RootState } from "../../app/store";
import { fetchUsers, oneUser } from "../../features/usersSlice";
import styles from "./ChatRoom.module.css";
import { RiChatDeleteLine } from "react-icons/ri";
import { MdPersonAddAlt1 } from "react-icons/md";
import { io, Socket } from "socket.io-client";
import moment from "moment-timezone";
moment.tz.setDefault("Europe/Moscow");

function ChatRoom() {
  const { chatId } = useParams<{ chatId: string }>();
  const chat = useSelector((state: RootState) => state.chat);
  const userOne = useSelector((state: RootState) => state.usersSlice.oneUser);
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.messages.messages);
  const [messageInput, setMessageInput] = useState("");
  const users = useSelector((state: RootState) => state.usersSlice.users);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showDateLabel, setShowDateLabel] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showUserList, setShowUserList] = useState(false); // Состояние для управления видимостью списка пользователей
  const [selectedUsers, setSelectedUsers] = useState([]);
  const messagesContainerRef = useRef(null);
  const [topMessageIndex, setTopMessageIndex] = useState(0);
  const [dateLabelTimeout, setDateLabelTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const chatUsers = chat.chats
    ?.find((chat) => chat._id === chatId)
    ?.participants.map((participant) =>
      users.find((user) => user._id === participant)
    );

  useEffect(() => {
    setLoadingMessages(true);

    if (chatId) {
      dispatch(fetchMessages(chatId)).then(() => {
        setLoadingMessages(false);
      });
      dispatch(fetchUsers());
      dispatch(oneUser());
    }

    if (!socket) {
      const newSocket = io("http://localhost:3000"); // Создание экземпляра Socket

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      newSocket.on("chatMessage", (message) => {
        dispatch(sendMessage(message));
      });

      newSocket.on("messageDeleted", (data) => {
        const { chatId, messageId } = data;
        dispatch(deleteMessage({ chatId, messageId }));
      });
      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [chatId]);

  const sendMessageHandler = (e) => {
    e.preventDefault();
    if (messageInput.trim() && userOne && socket) {
      setSendingMessage(true);

      const newMessage = {
        text: messageInput,
        sender: userOne._id,
        chat: chatId,
        timestamp: new Date().toISOString(),
      };
      socket?.emit("newMessage", newMessage);
      setMessageInput("");

      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
        setSendingMessage(false);
      }, 7000);
    }
  };

  const deleteMessageHandler = (messageId: string) => {
    dispatch(deleteMessage({ chatId, messageId }));

    if (userOne && chatId) {
      socket?.emit("deleteMessage", { chatId, messageId });
    }
  };

  function getUsernameColor(username: string) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = "#" + ((hash & 0x00ffffff) | 0x808080).toString(17);
    return color;
  }

  const openUserList = () => {
    setShowUserList(!showUserList);
    setSelectedUsers([]);
  };

  const addUserToChat = () => {
    if (selectedUsers.length > 0) {
      dispatch(addParticipant({ chatId, userId: [...selectedUsers] }));
      setShowUserList(false);
      setSelectedUsers([]);
    }
  };

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const scrollHandler = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;
    let foundTopMessage = false;
    let newTopMessageIndex = topMessageIndex;

    for (let i = 0; i < messages.length; i++) {
      const messageElement = container.childNodes[i];
      if (!messageElement) continue;
      const messageElementTop = messageElement.getBoundingClientRect().top;

      if (messageElementTop >= containerTop && !foundTopMessage) {
        newTopMessageIndex = i;
        foundTopMessage = true;
      }
    }

    if (foundTopMessage && newTopMessageIndex !== topMessageIndex) {
      setTopMessageIndex(newTopMessageIndex);
      setShowDateLabel(true);

      if (dateLabelTimeout) {
        clearTimeout(dateLabelTimeout);
      }

      // Скрыть дату через 3 секунды
      const timeoutId = setTimeout(() => {
        setShowDateLabel(false);
      }, 3000);

      setDateLabelTimeout(timeoutId);
    }
  };

  const formatDate = (timestamp) => {
    const momentTimestamp = moment(timestamp);

    const now = moment();
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    if (momentTimestamp.isSame(now, "day")) {
      return `сегодня, ${momentTimestamp.format("HH:mm")}`;
    } else if (momentTimestamp.isSame(yesterday, "day")) {
      return `вчера, ${momentTimestamp.format("HH:mm")}`;
    } else {
      return momentTimestamp.format("DD.MM.YY HH:mm");
    }
  };

  return (
    <div className={styles.chatRoom}>
      <div className={styles.chatHeader}>
        Chat Room {chat.chats[0]?.name}
        <div className={styles.addUsersBtn}>
          {userOne.isAdmin === true ? (
            <button className={styles.addUserButton} onClick={openUserList}>
              <MdPersonAddAlt1 />
            </button>
          ) : null}

          {showUserList && (
            <div className={styles.userListContainer}>
              <h2>Все юзеры</h2>
              <div className={styles.userList}>
                <ul>
                  {users.map((user) => (
                    <li key={user._id}>
                      <label>
                        <input
                          type="checkbox"
                          value={user._id}
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleUserSelection(user._id)}
                          disabled={chatUsers
                            .map((cu) => cu._id)
                            .includes(user._id)}
                        />
                        {user.login}{" "}
                        {chatUsers.map((cu) => cu._id).includes(user._id) &&
                          "(Добавлен)"}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={styles.userAdd} onClick={addUserToChat}>
                Добавить в чат
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={styles.chatMessages}
        ref={messagesContainerRef}
        onScroll={scrollHandler}
      >
        {loadingMessages ? (
          <div className={styles.loader}>Загрузка сообщений...</div>
        ) : (
          <>
            {showDateLabel && (
              <div className={styles.dateLabel}>
                {messages[topMessageIndex]
                  ? formatDate(messages[topMessageIndex].timestamp)
                  : ""}
              </div>
            )}
            {messages.map((message, index) => (
              <div className={styles.message} key={message.id}>
                {users.map((user) =>
                  user._id === message.sender ? (
                    <div
                      className={styles.userName}
                      key={user._id}
                      style={{ color: getUsernameColor(user.login) }}
                    >
                      {user.login}
                    </div>
                  ) : null
                )}
                <div className={styles.messageText}>{message.text}</div>
                <div className={styles.messageTime}>
                  {formatDate(message.timestamp)}
                </div>
                {userOne && userOne._id === message.sender ? (
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteMessageHandler(message._id)}
                  >
                    <RiChatDeleteLine />
                  </button>
                ) : null}
              </div>
            ))}
          </>
        )}
      </div>
      <form onSubmit={sendMessageHandler}>
        <div className={styles.chatInput}>
          <input
            type="text"
            placeholder="Напишите сообщение..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={sendingMessage}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={sendingMessage}
          >
            {sendingMessage ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatRoom;
