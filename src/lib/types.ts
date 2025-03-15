// noinspection JSUnusedGlobalSymbols

export interface Chat {
  id: number
  short_name: string
  long_name: string
  semester: number
  role: string
  link: string
}

export {};
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code: string;
          };
        };
      };
    };
  }
}
