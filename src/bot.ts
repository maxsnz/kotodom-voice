import { writeFileSync } from "node:fs";

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
  bot.launch().catch((e) => {
    // Don't linger half-alive: once the polling loop dies the process can keep
    // running (and a shallow healthcheck stays green) while commands silently
    // stop working. Graceful shutdown via bot.stop() resolves launch(), so this
    // only fires on a genuine fatal failure — exit non-zero and let
    // `restart: unless-stopped` bring the container back cleanly.
    console.error(
      "Failed to launch bot — exiting so Docker restarts the container",
      e
    );
    process.exit(1);
  });

  // Liveness heartbeat: refresh a file every 15s so the container healthcheck
  // can confirm the event loop is actually running — not just that a `bun`
  // process exists (which stays true even if the loop is wedged). The bot-dead
  // case is handled by process.exit(1) above; this catches a stalled loop.
  const HEARTBEAT_FILE = "/tmp/voice-heartbeat";
  const writeHeartbeat = () => {
    try {
      writeFileSync(HEARTBEAT_FILE, String(Date.now()));
    } catch (e) {
      console.error("Failed to write heartbeat file", e);
    }
  };
  writeHeartbeat();
  setInterval(writeHeartbeat, 15_000).unref();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
