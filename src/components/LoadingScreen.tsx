import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <Loader2 className="h-12 w-12 animate-spin text-gray-700 dark:text-gray-300" />
    </div>
  );
}
