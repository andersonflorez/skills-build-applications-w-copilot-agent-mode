/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CODESPACE_NAME: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
