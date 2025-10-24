const cron = require("node-cron");
const { Client } = require("pg");
const { getAllUrls, updateErrorCount, deleteUrls } = require("../db/url");
const { decrypt } = require("./encryption");

async function pingDb(connString) {
  const client = new Client({
    connectionString: connString,
  });
  try {
    await client.connect();
    await client.query("SELECT 1");
    console.log("Database ping successful");
    return true;
  } catch (error) {
    console.error("Database ping failed:", error);
    return false;
  } finally {
    await client.end();
  }
}

const startDailyPingJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily ping...");
    try {
      const data = await getAllUrls();

      for (const dbEntry of data) {
        try {
          const decryptedUrl = decrypt(dbEntry.url);
          const isSuccess = await pingDb(decryptedUrl);
          if (isSuccess) {
            await updateErrorCount(dbEntry.id, 0);
          } else {
            await updateErrorCount(dbEntry.id, 1);
          }
        } catch (error) {
          console.error(`Error pinging database ${dbEntry.id}:`, error);
          await updateErrorCount(dbEntry.id, 1);
        }
      }
    } catch (error) {
      console.error("Error during daily ping:", error);
    } finally {
      try {
        const deletedResult = await deleteUrls();
        console.log(
          `Cleaned up ${deletedResult.count} URLs with high error counts`
        );
      } catch (error) {
        console.error("Error cleaning up URLs:", error);
      }
    }
  });
};

module.exports = { pingDb, startDailyPingJob };
