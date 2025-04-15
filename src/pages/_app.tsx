/**
 * Main application component
 * 
 * This is the entry point for the Next.js application. It sets up:
 * - Global styles
 * - Theme provider for light/dark mode
 * - Internationalization (i18n) provider
 * - Loading state management
 */

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, useTheme } from "next-themes";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useUserData } from "@/hooks/useUserData";

/**
 * Main App component that wraps all pages
 * 
 * @param {AppProps} props - Standard Next.js App props containing Component and pageProps
 * @returns {JSX.Element} The rendered application with all providers
 */
export default function App({ Component, pageProps }: AppProps) {
  // Get loading state from user data hook
  const { isLoaded } = useUserData();
  // Get theme setter from next-themes
  const { setTheme } = useTheme();

  /**
   * Effect to set initial theme based on system preferences
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <I18nextProvider i18n={i18n}>
        {!isLoaded ? (
          <LoadingScreen />
        ) : (
          <Component {...pageProps} />
        )}
      </I18nextProvider>
    </ThemeProvider>
  );
}
