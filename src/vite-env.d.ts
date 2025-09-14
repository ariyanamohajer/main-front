/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />


declare const grecaptcha: {
  enterprise: {
    execute(siteKey: string, options: { action: string }): Promise<string>;
    ready(cb: () => void): void;
  };
};
