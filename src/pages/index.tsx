/**
 * Main page component
 * 
 * This is the home page of the application
 */

"use client"

import { useState } from "react"
import Head from "next/head"
import SearchBar from "@/components/SearchBar"
import SavedChats from "@/components/SavedChats"
import ActionButtons from "@/components/ActionButtons"
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, SettingsIcon } from "lucide-react";
import { Settings } from "@/components/Settings";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Chat } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { useUserData } from "@/hooks/useUserData";

/**
 * Home page component
 * 
 * @returns {JSX.Element} The rendered home page
 */
export default function Home() {
  // State for settings modal visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  // State for the currently selected chat
  const [selectedChat, setSelectedChat] = useState<Chat|null>(null)
  // Translation function from i18next
  const { t } = useTranslation();

  /**
   * Get user data from the custom hook
   * - chats: All available chats
   * - savedChats: Chats saved by the user
   * - savedChatsIds: IDs of chats saved by the user
   * - telegramId: User's Telegram ID
   * - language: User's preferred language
   * - toggleLikedStatus: Function to toggle saved status of a chat
   */
  const {
    chats,
    savedChats,
    savedChatsIds,
    telegramId,
    language,
    toggleLikedStatus
  } = useUserData();

  /**
   * Render the home page UI
   */
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
