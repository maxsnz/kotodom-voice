import { env } from "./config";

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

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
    LanguageCode: env.AWS_LANGUAGE_CODE,
    OutputFormat: "mp3",
    VoiceId: env.AWS_VOICE_ID,
    TextType: "ssml",
  });
  const response = await client.send(command);
  return response.AudioStream;
};

export default speech;
