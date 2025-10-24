const {encrypt} = require('../utils/encryption');
const {pingDb} = require('../utils/pinger');
const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();

class UrlController {
    addUrl = async (req, res) => {
        try {
            const {url} = req.body;
            const isValid = await pingDb(url);
            if (!isValid) {
                return res.status(400).json({error: "Invalid URL or Database Unreachable"});
            }
            const encryptedUrl = encrypt(url);
            const newUrl = await prisma.url.create({
                data: {
                    url: encryptedUrl
                }
            });
            res.status(201).json(newUrl);
        } catch (error) {
            console.error("Error adding URL:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }

    getUrls = async (req, res) => {
        try {
            const urls = await prisma.url.findMany();
            res.status(200).json(urls);
        } catch (error) {
            console.error("Error fetching URLs:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
}

module.exports = new UrlController();