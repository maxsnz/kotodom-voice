import { env } from "./config";

import {
  PollyClient,
  SynthesizeSpeechCommand,
  type LanguageCode,
  type VoiceId,
} from "@aws-sdk/client-polly";

const config = {
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: env.AWS_KEY,
    secretAccessKey: env.AWS_SECRET,
  },
};

const speech = async (text: string) => {
  const client = new PollyClient(config);
  const command = new SynthesizeSpeechCommand({
    Text: `<speak><break time="1s"/>${text}<break time="1s"/></speak>`,
    Engine: "standard",
    // SDK ужесточил типы LanguageCode/VoiceId до string literal union'ов.
    // Валидируем мы их в config.ts по реальному списку из AWS docs (или
    // просто доверяем env'у), здесь — узкий cast, чтобы пропустить tsc.
    LanguageCode: env.AWS_LANGUAGE_CODE as LanguageCode,
    OutputFormat: "mp3",
    VoiceId: env.AWS_VOICE_ID as VoiceId,
    TextType: "ssml",
  });
  const response = await client.send(command);
  return response.AudioStream;
};

export default speech;
