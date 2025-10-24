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

const updateErrorCount = async (id, count) => {
    try {
        const updatedUrl = await prisma.url.update({
            where: { id },
            data: {
                errorCount: count === 0 ? 0 : { increment: 1 }
            }
        });
        return updatedUrl;
    } catch (error) {
        throw error;
    }
};

const deleteUrls = async () => {
    try {
        const deletedUrls = await prisma.url.deleteMany({
            where: {
                errorCount: {
                    gt: 10
                }
            }
        });
        return deletedUrls;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUrls,
    createUrl,
    updateErrorCount,
    deleteUrls
};
