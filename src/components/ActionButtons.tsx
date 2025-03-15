import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useTranslation } from 'react-i18next';

export default function ActionButtons() {

  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-2 bg-white/90 dark:bg-gray-900 backdrop-blur-sm rounded-lg p-4">
      <Link href="https://t.me/+WxvPLBkSuYMyNGQ0" className="w-full">
        <Button variant="outline" className="w-full dark:text-white dark:border-gray-600">
          {t('action.guide')}
        </Button>
      </Link>

      <Link href="https://t.me/cvut_fit" className="w-full">
        <Button variant="outline" className="w-full dark:text-white dark:border-gray-600">
          {t('action.general')}
        </Button>
      </Link>

      <Link href="https://t.me/+XLA45FH53gdiNGVi" className="w-full">
        <Button variant="outline" className="w-full dark:text-white dark:border-gray-600">
          {t('action.offtopic')}
        </Button>
      </Link>
    </div>
  )
}