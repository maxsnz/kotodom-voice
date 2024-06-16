const express = require("express");
const fs = require("fs");
const path = require("path");
const { Data } = require("../models");
const store = require("./store");

const port = process.env.PORT || 8080;

const app = express();

app.use("/api/message", async (req, res) => {
  try {
    const data = await Data.findAll({
      limit: 1,
      where: {},
      order: [["createdAt", "DESC"]],
    });
    res.send(JSON.stringify(data[0]));
  } catch (error) {
    console.error(error);
    res.send("unknownError");
  }
});

app.use("/stream", async (req, res) => {
  try {
    const data = await Data.findAll({
      limit: 1,
      where: {},
      order: [["createdAt", "DESC"]],
    });
    const message = data?.[0];

    if (!message?.fileId) {
      res.send();
      return;
    }
    if (message.isRead) {
      res.send();
      return;
    }

    const fileName = `${message.fileId}.mp3`;
    const filePath = path.resolve(__dirname, `../tmp/${fileName}`);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mp3",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "audio/mp3",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
    await message.update({ isRead: true });
  } catch (error) {
    console.error(error);
    res.send("unknownError");
  }
});

const server = app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
