/**
 * Custom Document component for Telegram API integration
 * 
 * This file customizes the HTML document structure to integrate Telegram API
 * - Telegram Web App script for integration with Telegram
 */

import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

/**
 * Custom Document component that extends the default Next.js Document
 * 
 * @returns {JSX.Element} The HTML document structure
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="FIT CTU chat manager"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <body className="antialiased">
      <Main/>
      <NextScript/>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive"/>
      </body>
    </Html>
  );
}
