import * as dotenv from "dotenv";

dotenv.config();

interface EnvironmentConfig {
  NODE_ENV: string;
  TELEGRAM_TOKEN: string;
  LOGTAIL_TOKEN?: string;
  LOGTAIL_SOURCE?: string;
  AWS_KEY: string;
  AWS_SECRET: string;
  AWS_LANGUAGE_CODE: string;
  AWS_VOICE_ID: string;
}

function validateEnv(): EnvironmentConfig {
  const requiredVars = ["TELEGRAM_TOKEN", "AWS_KEY", "AWS_SECRET"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  const config: EnvironmentConfig = {
    NODE_ENV: process.env.NODE_ENV || "development",
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN!,
    AWS_KEY: process.env.AWS_KEY!,
    AWS_SECRET: process.env.AWS_SECRET!,
    AWS_LANGUAGE_CODE: process.env.AWS_LANGUAGE_CODE || "ru-RU",
    AWS_VOICE_ID: process.env.AWS_VOICE_ID || "Maxim",
  };

  if (process.env.LOGTAIL_TOKEN) {
    config.LOGTAIL_TOKEN = process.env.LOGTAIL_TOKEN;
  }

  if (process.env.LOGTAIL_SOURCE) {
    config.LOGTAIL_SOURCE = process.env.LOGTAIL_SOURCE;
  }

  return config;
}

export const env = validateEnv();
export default env;
