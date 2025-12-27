import { Telegraf } from "telegraf";
import speech from "./speech";

import { env } from "./config";

const bot = new Telegraf(env.TELEGRAM_TOKEN);

console.log("bot started");

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.on("text", async (ctx) => {
  try {
    await ctx.sendChatAction("typing");
    console.log(`message: ${ctx.message.text}`);

    if (ctx.message.text?.length > 5) {
      const text = ctx.message.text;
      const audioStream = await speech(text);

      if (!audioStream) {
        throw new Error("Failed to generate audio stream");
      }

      const response = await ctx.replyWithVoice({
        // @ts-expect-error - TODO: fix this
        source: audioStream,
      });
    } else {
      await ctx.reply("Слишком короткое сообщение");
    }
  } catch (e) {
    console.error(e);
  }
});

export const runBot = () => {
  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
