"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { useTheme } from "next-themes"
import SearchBar from "@/components/SearchBar"
import SavedChats from "@/components/SavedChats"
import ActionButtons from "@/components/ActionButtons"
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, SettingsIcon } from "lucide-react";
import { Settings } from "@/components/Settings";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Chat } from "@/lib/types";
import { getTelegramUser } from "@/lib/telegram";
import { useTranslation } from "react-i18next";


export default function Home() {
  const [chats, setChats] = useState<Chat[]>([])
  const [savedChatsIds, setSavedChatsIds] = useState<number[]>([])
  const [savedChats, setSavedChats] = useState<Chat[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<Chat|null>(null)
  const [telegramId, setTelegramId] = useState<number|null>(null);
  const [language, setLanguage] = useState<string|null>(null);
  const { setTheme, resolvedTheme } = useTheme();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const telegramUser = getTelegramUser();
    if (telegramUser) {
      setTelegramId(telegramUser.id);
    }

    fetch(`api/chats`)
      .then(res => res.json())
      .then(data => {
        setChats(data)
      })
      .catch(error => console.error(error));

    fetch(`/api/user/${telegramUser?.id}/user`)
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
          setTheme(resolvedTheme);
          setSavedChats([]);
        } else {
          setLanguage(data.language);
          i18n.changeLanguage(data.language)
            .catch(error => console.error(error));
          setTheme(data.theme);
          setSavedChatsIds(data.savedChats)
        }
      })
      .catch(error => console.error(error));
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

  return (
    <>
      <Head>
        <title>University Chat Manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <main
        className="min-h-screen w-full max-w-md mx-auto p-4 bg-cover bg-center relative dark:bg-gray-900"
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <Button className="relative z-10 mt-6" variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}
                    aria-label="Open settings">
              <SettingsIcon className="h-[1.2rem] w-[1.2rem]"/>
            </Button>
            <div className="flex-grow">
              {language && <SearchBar chats={chats} setSelectedChatFunction={setSelectedChat} language={language}/>}
            </div>
          </div>
          {selectedChat && (
            <Card className="gap-4 mt-4 p-4 dark:bg-gray-800/90">
              <div className="flex items-center justify-between">
                <div className="font-bold text-lg dark:text-white">{selectedChat.short_name}</div>
                <div
                  className="text-gray-600 dark:text-gray-500 ml-4">{t('search.semester')}: {selectedChat.semester} {t('search.role')}: {selectedChat.role}</div>
              </div>
              <div className="text-gray-600 dark:text-gray-500">{selectedChat.long_name}</div>
              <div className="flex justify-between">
                <Link href={selectedChat.link}>
                  <Button variant="outline" className="flex items-center gap-2 dark:text-white dark:border-gray-600">
                    <ExternalLink className="h-4 w-4"/>
                    {t('search.link')}
                  </Button>
                </Link>
                <Button onClick={() => toggleLikedStatus(selectedChat?.id)} variant="outline"
                        className="flex items-center gap-2 dark:text-white dark:border-gray-600">
                  {!savedChatsIds?.includes(selectedChat.id) ? <Heart className="h-4 w-4"/> :
                    <Heart className="h-4 w-4 fill-red-500 text-red-500"/>}
                </Button>
              </div>
            </Card>
          )}
          <ActionButtons/>
          {telegramId && <SavedChats savedChats={savedChats} toggleLikedStatus={toggleLikedStatus} id={telegramId}/>}
          <div className="flex justify-center">
            <Link href="https://t.me/addstickers/Fitaky" className="w-11/12 max-w-md">
              <Button variant="outline" className="w-full dark:text-white dark:border-gray-600">
                {t('action.stickers')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      {telegramId && language &&
        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} id={telegramId} lang={language}/>}
    </>
  )
}