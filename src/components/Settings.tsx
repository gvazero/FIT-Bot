"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';

const languages = [
  { code: "en", flag: "🇬🇧" },
  { code: "ru", flag: "🇷🇺" },
  { code: "uk", flag: "🇺🇦" },
  { code: "kz", flag: "🇰🇿" },
  { code: "cz", flag: "🇨🇿" },
]

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  id: number
  lang: string
}

export function Settings({ isOpen, onClose, id, lang }: SettingsProps) {
  const { theme, setTheme } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState(lang)

  const changeTheme = async (newTheme: string) => {
    if (newTheme === theme) return
    setTheme(newTheme)
    await fetch(`/api/user/${id}/theme`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    })
  }

  const { t, i18n } = useTranslation();

  const changeLanguage = async (newLanguage: string) => {
    if (newLanguage === selectedLanguage) return
    setSelectedLanguage(newLanguage)
    await i18n.changeLanguage(newLanguage)

    await fetch(`/api/user/${id}/language`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: newLanguage }),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="ml-8 mr-8 bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('settings.title')}</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{t('settings.language')}</h3>
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                onClick={() => changeLanguage(lang.code)}
                className="w-10 h-10 p-0"
              >
                {lang.flag}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{t('settings.theme')}</h3>
          <div className="flex space-x-2">
            <Button
              variant={theme === "light" ? "outline" : "default"}
              onClick={() => changeTheme("light")}
              className="flex items-center"
            >
              <Sun className="mr-2 h-4 w-4"/>
              {t('settings.light')}
            </Button>
            <Button
              variant={theme === "dark" ? "outline" : "default"}
              onClick={() => changeTheme("dark")}
              className="flex items-center"
            >
              <Moon className="mr-2 h-4 w-4"/>
              {t('settings.dark')}
            </Button>
          </div>
        </div>

        <Button onClick={onClose} className="mt-6 w-full">
          {t('settings.close')}
        </Button>
      </div>
    </div>
  )
}