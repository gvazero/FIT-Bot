import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Chat } from "@/lib/types";
import { getTelegramUser } from "@/lib/telegram";

export function useUserData() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [savedChatsIds, setSavedChatsIds] = useState<number[]>([]);
  const [savedChats, setSavedChats] = useState<Chat[]>([]);
  const [telegramId, setTelegramId] = useState<number | null>(null);
  const [language, setLanguage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const setThemeRef = useRef(setTheme);
  const { i18n } = useTranslation();

  useEffect(() => {
    setThemeRef.current = setTheme;
  }, [setTheme]);

  useEffect(() => {
    const telegramUser = getTelegramUser();
    if (telegramUser) {
      setTelegramId(telegramUser.id);
    }

    const chatsPromise = fetch(`api/chats`)
      .then(res => res.json())
      .then(data => {
        setChats(data);
      })
      .catch(error => {
        console.error(error);
        return Promise.resolve();
      });

    const userDataPromise = fetch(`/api/user/${telegramUser?.id}/user`)
      .then(response => response.json().then(data => ({ status: response.status, data })))
      .then(({ status, data }) => {
        if (status === 201 && telegramUser && resolvedTheme) {
          fetch(`/api/user/${telegramUser?.id}/language`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: telegramUser.language_code })
          }).catch(error => console.error(error));

          if (['en', 'ru', 'uk', 'kz', 'cz'].includes(telegramUser.language_code)) {
            setLanguage(telegramUser.language_code);
            i18n.changeLanguage(telegramUser.language_code)
              .catch(error => console.error(error));
          } else {
            setLanguage('en');
            i18n.changeLanguage('en')
              .catch(error => console.error(error));
          }

          fetch(`/api/user/${telegramUser?.id}/theme`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme: resolvedTheme }),
          }).catch(error => console.error(error));
          setThemeRef.current(resolvedTheme);
          setSavedChats([]);
        } else {
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

  useEffect(() => {
    setSavedChats(chats.filter(chat => savedChatsIds.includes(chat.id)));
  }, [chats, savedChatsIds]);

  const toggleLikedStatus = (chatId: number) => {
    setSavedChats((prevChats) => {
      const isAlreadySaved = savedChatsIds?.includes(chatId) ?? false;

      return isAlreadySaved
        ? prevChats.filter((chat) => chat.id !== chatId)
        : [...prevChats, chats.find((chat) => chat.id === chatId)!];
    });

    setSavedChatsIds((prevIds = []) => {
      const updatedIds = prevIds.includes(chatId)
        ? prevIds.filter((id) => id !== chatId)
        : [...prevIds, chatId];

      fetch(`/api/user/${telegramId}/saved-chats`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedChatsIds: updatedIds })
      }).catch(error => console.error(error));

      return updatedIds;
    });
  };

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
