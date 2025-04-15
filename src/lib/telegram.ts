/**
 * Telegram integration utilities
 * 
 * This is the provider of functions for interacting with the Telegram Web App API.
 */

/**
 * Retrieves the current Telegram user from the Telegram Web App
 * 
 * @returns {Object|null} The Telegram user object if available, or null if not in a Telegram Web App context
 */
export function getTelegramUser() {
  if (typeof window !== "undefined" && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
}
