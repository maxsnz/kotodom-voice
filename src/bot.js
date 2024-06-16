const { Telegraf } = require("telegraf");
// const { Keyboard } = require("telegram-keyboard");
const fs = require("fs");
const path = require("path");
const speech = require("./speech");

// DISABLED DB
// const { Data } = require("../models");

// const store = require("./store");

require("dotenv").config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw Error("no process.env.TELEGRAM_BOT_TOKEN found");
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log("bot started");

// const someKeyboard = {
//   reply_markup: {
//     one_time_keyboard: false,
//     keyboard: [["red"], ["green"], ["blue"], ["yellow"], ["off"]],
//   },
// };

// const keyboard = Keyboard.make([
//   ["red", "green"], // First row
//   ["blue", "yellow"], // Second row
// ]).reply();

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
// bot.hears("go", (ctx) => {
//   bot.telegram.sendMessage(ctx.chat.id, "What color?", someKeyboard);
// });

bot.on("text", async (ctx) => {
  // Explicit usage
  try {
    console.log(`message: ${ctx.message.text}`);

    // DISABLED DB
    // const messageId = Math.floor(Date.now() / 1000);
    // const message = await Data.create({
    //   fileId: null,
    //   isRead: false,
    //   message: ctx.message.text,
    // });

    if (ctx.message.text?.length > 5) {
      // const text = `Сообщение от ${ctx.message.from.first_name || ""} ${
      //   ctx.message.from.last_name || ""
      // }. ${ctx.message.text}`;
      const text = ctx.message.text;
      const audioStream = await speech(text);

      const response = await ctx.replyWithVoice({
        source: audioStream,
      });

      // DISABLED FILE STORING
      // const filepath = path.resolve(__dirname, `../tmp/${messageId}.mp3`);
      // await fs.promises.writeFile(filepath, audioStream);

      // DISABLED DB
      // await message.update({ fileId: messageId });

      // store.set("music", audioStream);
      // console.log("response", response);
    } else {
      await ctx.reply("Слишком короткое сообщение");
    }
  } catch (e) {
    console.error(e);
  }
});

// bot.on("callback_query", async (ctx) => {
//   await Data.create({
//     fileId: "",
//     isRead: false,
//     message: ctx.callbackQuery.data,
//   });
// });

const runBot = () => {
  bot.launch();
};

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = runBot;
