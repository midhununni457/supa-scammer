const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();

const getAllUrls = async () => {
    try {
        const urls = await prisma.url.findMany();
        return urls;
    } catch (error) {
        throw error;
    }
};

const createUrl = async (encryptedUrl) => {
    try {
        const newUrl = await prisma.url.create({
            data: {
                url: encryptedUrl
            }
        });
        return newUrl;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUrls,
    createUrl
};
