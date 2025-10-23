const {encrypt} = require('../utils/encryption');
const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();

class UrlController {
    addUrl = async (req, res) => {
        try {
            const {url} = req.body;
            console.log("Received URL to add:", url);
            const encryptedUrl = encrypt(url);
            console.log("Encrypted URL:", encryptedUrl);
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