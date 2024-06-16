const { Telegraf } = require("telegraf");
const speech = require("./speech");

require("dotenv").config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw Error("no process.env.TELEGRAM_BOT_TOKEN found");
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log("bot started");

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.on("text", async (ctx) => {
  try {
    console.log(`message: ${ctx.message.text}`);

    if (ctx.message.text?.length > 5) {
      const text = ctx.message.text;
      const audioStream = await speech(text);

      const response = await ctx.replyWithVoice({
        source: audioStream,
      });
    } else {
      await ctx.reply("Слишком короткое сообщение");
    }
  } catch (e) {
    console.error(e);
  }
});

const runBot = () => {
  bot.launch();
};

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = runBot;
