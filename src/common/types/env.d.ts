declare namespace NodeJS {
  interface ProcessEnv {
    // Application
    PORT: string;

    // Database
    DB_PORT: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;

    // Secrets
    COOKIE_SECRET: string;
    OTP_TOKEN_SECRET: string;
  }
}
