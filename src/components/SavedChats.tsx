import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Chat } from "@/lib/types";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

interface SavedChatsProps {
  savedChats: Chat[]
  toggleLikedStatus: (chatId: number) => void
  id: number
}

export default function SavedChats({ savedChats, toggleLikedStatus }: SavedChatsProps) {

  const { t } = useTranslation();

  return (
    <div className="mb-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border shadow-sm">
      <h2 className="text-lg font-bold mb-3 dark:text-white">{t('saved.title')}</h2>
      <div className="space-y-2">
        {savedChats.map((chat) => (
          <div key={chat.id}
               className="flex items-center justify-between mb-2 p-2 pl-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <Link href={chat.link} className="flex-grow">
              <span className="font-medium dark:text-white mr-2">{chat.short_name}</span>
              <div className="flex items-center">
                <span className="font-extralight text-sm text-gray-600 dark:text-gray-400">{chat.long_name}</span>
              </div>
            </Link>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLikedStatus(chat.id);
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 dark:text-gray-300"
            >
              <X className="h-4 w-4"/>
            </Button>
          </div>
        ))}
        {savedChats.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-2">{t('saved.empty')}</p>}
      </div>
    </div>
  )
}