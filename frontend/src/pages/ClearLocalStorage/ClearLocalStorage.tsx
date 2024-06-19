// src/ClearLocalStorage.js
import { useEffect } from 'react';

const ClearLocalStorage = () => {
  useEffect(() => {
    // Function to clear localStorage items with keys starting with a specific prefix
    const clearLocalStorageItems = () => {
        localStorage.removeItem("bp-chat-user-lang-17e6d185995c086dbd55e7862760881cfc981c7b10e96ccfea434d2b81bbb7eb");
        localStorage.removeItem("bp-chat-creds-17e6d185995c086dbd55e7862760881cfc981c7b10e96ccfea434d2b81bbb7eb");
        localStorage.clear();
    };


    clearLocalStorageItems();
  }, []);

  return null;
};

export default ClearLocalStorage;
