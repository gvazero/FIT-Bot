"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Chat } from "@/lib/types";
import { transliterate } from "transliteration";
import removeAccents from "remove-accents";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  chats: Chat[]
  setSelectedChatFunction: (chat: Chat|null) => void
  language: string
}

export default function SearchBar({ chats, setSelectedChatFunction, language }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [filteredChats, setFilteredChats] = useState<Chat[]>([])

  const normalizeText = (text: string) => {
    return removeAccents(transliterate(text)).toLowerCase();
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats([]);
      return;
    }

    const normalizedQuery = normalizeText(searchQuery);

    if (/[\u0400-\u04FF]/.test(searchQuery)) { //cyrillic
      import('convert-layout/ru')
        .then((ru) => {
          const normalizedQueryFromRu = normalizeText(ru.toEn(searchQuery));

          const filtered = chats
            .filter((chat) =>
              normalizeText(chat.short_name).includes(normalizedQuery) ||
              normalizeText(chat.long_name).includes(normalizedQuery) ||
              normalizeText(chat.short_name).includes(normalizedQueryFromRu) ||
              normalizeText(chat.long_name).includes(normalizedQueryFromRu)
            )
            .slice(0, 3);

          setFilteredChats(filtered);
        })
        .catch((error) => {
          console.error('Error importing converter:', error);
        });
      return;
    }

    const filtered = chats //non-cyrillic
      .filter((chat) =>
        normalizeText(chat.short_name).includes(normalizedQuery) ||
        normalizeText(chat.long_name).includes(normalizedQuery)
      )
      .slice(0, 3);

    setFilteredChats(filtered);
  }, [searchQuery, chats, language]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChatFunction(chat)
    setIsSearchFocused(false)
    setSearchQuery("")
  }

  const { t } = useTranslation();

  return (
    <>
      <div className="mt-6 relative flex-grow">
        <div className="relative z-20">
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-500 h-5 w-5"/>
        </div>

        {isSearchFocused && (
          <>
            <div
              className="fixed inset-0 bg-gray/30 backdrop-blur-sm z-10"
              onClick={() => setIsSearchFocused(false)}
            ></div>
            <div
              className="absolute w-full mt-2 bg-white dark:bg-gray-800/90 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
              {filteredChats.length > 0
                ? filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleChatSelect(chat)}
                  >
                    <p className="font-medium">{chat.short_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-500">{chat.long_name}</p>
                  </div>
                ))
                : searchQuery.trim() !== "" && <div className="p-3 text-center text-gray-500">No chats found</div>}
            </div>
          </>
        )}
      </div>
    </>
  )
}