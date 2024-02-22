// components/UniqueUsernameFetcher.js
import { useEffect } from 'react';
import io from 'socket.io-client';

const UniqueUsernameFetcher = ({ onUsernameFetched }) => {
  useEffect(() => {
    const socket = io('https://nextdraw.onrender.com');

    const getUsernameFromLocalStorage = () => {
      return localStorage.getItem('username');
    };

    const saveUsernameToLocalStorage = (username) => {
      localStorage.setItem('username', username);
    };

    const closeSocket = () => {
      socket.close();
    };

 
    // Fetch username from local storage
    let username = getUsernameFromLocalStorage();

    if (!username) {
      // Request a unique username from the server
      socket.emit('request-unique-username');

      // Listen for response from the server
      socket.on('unique-username', (uniqueUsername) => {
        console.log(`Assigned unique username ${uniqueUsername}`);
        // Save username to local storage
        saveUsernameToLocalStorage(uniqueUsername);
      
        closeSocket();
       
     
        onUsernameFetched(uniqueUsername);
      });
    } else {
      console.log(`Using existing username ${username}`);
      // Close socket connection
      closeSocket();
    
      onUsernameFetched(username);
    }

    // Clean up function to close the socket connection
    return () => {
      closeSocket();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default UniqueUsernameFetcher;
