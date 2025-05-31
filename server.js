const express = require("express");
const venom = require("venom-bot");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

venom
  .create({
    session: "chat-bot",
    multidevice: true,
  })
  .then((client) => {
    console.log("Bot Siap");

    app.get("/", (req, res) => {
      res.send("Bot Aktif");
    });

    app.post("/send-pesan", async (req, res) => {
      const { to, pesan } = req.body;

      if (!to || !pesan) {
        return res.status(400).json({
          status: "error",
          pesan: "parameter to dan pesan wajib diisi!",
        });
      }

      try {
        await client.sendText(to, pesan);
        res.json({ status: "berhasil", to, pesan });
      } catch (error) {
        console.error("Error mengirim pesan:", error);
        res.status(500).json({ status: "error", error: error.toString() });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Bot berjalan di port $(PORT)");
    });
  })
  .catch((err) => {
    console.error("Bot gagal membuat session:", err);
  });
