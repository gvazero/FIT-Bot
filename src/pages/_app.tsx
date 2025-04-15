import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, useTheme } from "next-themes";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useUserData } from "@/hooks/useUserData";

export default function App({ Component, pageProps }: AppProps) {
  const { isLoaded } = useUserData();
  const { setTheme } = useTheme();

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
