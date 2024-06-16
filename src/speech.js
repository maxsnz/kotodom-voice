require("dotenv").config();

const {
  PollyClient,
  SynthesizeSpeechCommand,
} = require("@aws-sdk/client-polly");

const config = {
  region: "ap-southeast-1",
};

if (process.env.AWS_KEY && process.env.AWS_SECRET) {
  config.credentials = {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  };
}

const speech = async (text) => {
  const client = new PollyClient(config);
  const command = new SynthesizeSpeechCommand({
    Text: `<speak><break time="1s"/>${text}<break time="1s"/></speak>`,
    Engine: "standard",
    LanguageCode: process.env.AWS_LANGUAGE_CODE || "ru-RU",
    OutputFormat: "mp3",
    VoiceId: process.env.AWS_VOICE_ID || "Maxim",
    TextType: "ssml",
  });
  const response = await client.send(command);
  return response.AudioStream;
};

module.exports = speech;
