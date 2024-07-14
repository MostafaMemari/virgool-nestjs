declare namespace NodeJS {
  interface ProcessEnv {
    // Application
    PORT: string; // Use string instead of number
    // Database
    DB_PORT: string; // Use string instead of number
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
  }
}
