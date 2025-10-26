const { encrypt } = require("../utils/encryption");
const { pingDb } = require("../utils/pinger");
const { createUrl } = require("../db/url");

const addUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const isValid = await pingDb(url);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Invalid URL or Database Unreachable" });
    }
    const encryptedUrl = encrypt(url);
    const newUrl = await createUrl(encryptedUrl);
    res.status(201).json(newUrl);
  } catch (error) {
    console.error("Error adding URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const ping = (req, res) => {
  console.log("Ping received");
  res.json({ status: "ok" });
};

module.exports = { addUrl, ping };
