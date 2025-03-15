// noinspection JSUnresolvedLibraryURL

import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

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
