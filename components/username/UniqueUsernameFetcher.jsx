// components/UniqueUsernameFetcher.js
import { useEffect } from "react";
import io from "socket.io-client";

const UniqueUsernameFetcher = ({ onUsernameFetched }) => {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET);

    const getUsernameFromLocalStorage = () => {
      return localStorage.getItem("username");
    };

    const saveUsernameToLocalStorage = (username) => {
      localStorage.setItem("username", username);
    };

    const closeSocket = () => {
      socket.close();
    };

    let username = getUsernameFromLocalStorage();

    if (!username) {
      socket.emit("request-unique-username");

      socket.on("unique-username", (uniqueUsername) => {
        console.log(`Assigned unique username ${uniqueUsername}`);

        saveUsernameToLocalStorage(uniqueUsername);

        closeSocket();

        onUsernameFetched(uniqueUsername);
      });
    } else {
      console.log(`Using existing username ${username}`);

      closeSocket();

      onUsernameFetched(username);
    }

    return () => {
      closeSocket();
    };
  }, []);

  return null;
};

export default UniqueUsernameFetcher;
