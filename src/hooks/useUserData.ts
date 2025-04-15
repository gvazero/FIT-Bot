/**
 * Custom hook for managing user data
 * 
 * This is a React hook that handles user data fetching, state management,
 * and synchronization with the backend API. It manages user preferences like theme,
 * language, and saved chats.
 */

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Chat } from "@/lib/types";
import { getTelegramUser } from "@/lib/telegram";

/**
 * Custom hook that manages user data and preferences
 * 
 * @returns {Object} An object containing user data and functions to manipulate it
 */
export function useUserData() {
  // State for all available chats
  const [chats, setChats] = useState<Chat[]>([]);
  // State for IDs of chats saved by the user
  const [savedChatsIds, setSavedChatsIds] = useState<number[]>([]);
  // State for the full chat objects that are saved by the user
  const [savedChats, setSavedChats] = useState<Chat[]>([]);
  // State for the user's Telegram ID
  const [telegramId, setTelegramId] = useState<number | null>(null);
  // State for the user's preferred language
  const [language, setLanguage] = useState<string | null>(null);
  // State to track if data has been loaded
  const [isLoaded, setIsLoaded] = useState(false);
  // Theme utilities from next-themes
  const { setTheme, resolvedTheme } = useTheme();
  // Ref to keep the latest setTheme function
  const setThemeRef = useRef(setTheme);
  // i18n utilities for translations
  const { i18n } = useTranslation();

  /**
   * Update the theme reference when the setTheme function changes
   */
  useEffect(() => {
    setThemeRef.current = setTheme;
  }, [setTheme]);

  /**
   * Main effect for fetching user data and chats
   */
  useEffect(() => {
    // Get Telegram user information
    const telegramUser = getTelegramUser();
    if (telegramUser) {
      setTelegramId(telegramUser.id);
    }

    // Fetch all available chats
    const chatsPromise = fetch(`api/chats`)
      .then(res => res.json())
      .then(data => {
        setChats(data);
      })
      .catch(error => {
        console.error(error);
        return Promise.resolve();
      });

    // Fetch user data or create new user if it doesn't exist
    const userDataPromise = fetch(`/api/user/${telegramUser?.id}/user`)
      .then(response => response.json().then(data => ({ status: response.status, data })))
      .then(({ status, data }) => {
        // If user was just created (status 201)
        if (status === 201 && telegramUser && resolvedTheme) {
          // Set user's language preference from Telegram
          fetch(`/api/user/${telegramUser?.id}/language`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: telegramUser.language_code })
          }).catch(error => console.error(error));

          // Set language in the app based on Telegram language or fallback to English
          if (['en', 'ru', 'uk', 'kz', 'cz'].includes(telegramUser.language_code)) {
            setLanguage(telegramUser.language_code);
            i18n.changeLanguage(telegramUser.language_code)
              .catch(error => console.error(error));
          } else {
            setLanguage('en');
            i18n.changeLanguage('en')
              .catch(error => console.error(error));
          }

          // Set user's theme preference
          fetch(`/api/user/${telegramUser?.id}/theme`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme: resolvedTheme }),
          }).catch(error => console.error(error));
          setThemeRef.current(resolvedTheme);
          setSavedChats([]);
        } else {
          // If user already exists, use stored preferences
          setLanguage(data.language);
          i18n.changeLanguage(data.language)
            .catch(error => console.error(error));
          setThemeRef.current(data.theme);
          setSavedChatsIds(data.savedChats);
        }
      })
      .catch(error => {
        console.error(error);
        return Promise.resolve();
      });

    Promise.all([chatsPromise, userDataPromise])
      .finally(() => {
        setIsLoaded(true);
      });
  }, [i18n]);

  /**
   * Effect to update savedChats whenever chats or savedChatsIds change
   * 
   * This keeps the savedChats array in sync with the savedChatsIds array
   */
  useEffect(() => {
    setSavedChats(chats.filter(chat => savedChatsIds.includes(chat.id)));
  }, [chats, savedChatsIds]);

  /**
   * Toggles the saved/liked status of a chat
   * 
   * This function:
   * 1. Updates the savedChats state by adding or removing the chat
   * 2. Updates the savedChatsIds state by adding or removing the chat ID
   * 3. Syncs the changes with the backend API
   * 
   * @param {number} chatId - The ID of the chat to toggle
   */
  const toggleLikedStatus = (chatId: number) => {
    // Update the savedChats array
    setSavedChats((prevChats) => {
      const isAlreadySaved = savedChatsIds?.includes(chatId) ?? false;

      return isAlreadySaved
        ? prevChats.filter((chat) => chat.id !== chatId) // Remove chat if already saved
        : [...prevChats, chats.find((chat) => chat.id === chatId)!]; // Add chat if not saved
    });

    // Update the savedChatsIds array and sync with backend
    setSavedChatsIds((prevIds = []) => {
      const updatedIds = prevIds.includes(chatId)
        ? prevIds.filter((id) => id !== chatId) // Remove ID if already saved
        : [...prevIds, chatId]; // Add ID if not saved

      // Sync changes with backend
      fetch(`/api/user/${telegramId}/saved-chats`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedChatsIds: updatedIds })
      }).catch(error => console.error(error));

      return updatedIds;
    });
  };

  /**
   * Return an object with all the user data and functions
   * 
   * @returns {Object} Object containing:
   *   - chats: All available chats
   *   - savedChats: Chats saved by the user
   *   - savedChatsIds: IDs of chats saved by the user
   *   - telegramId: User's Telegram ID
   *   - language: User's preferred language
   *   - toggleLikedStatus: Function to toggle saved status of a chat
   *   - isLoaded: indicator if data has been loaded
   */
  return {
    chats,
    savedChats,
    savedChatsIds,
    telegramId,
    language,
    toggleLikedStatus,
    isLoaded
  };
}
