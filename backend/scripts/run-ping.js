require("dotenv").config();
const { getAllUrls, updateErrorCount, deleteUrls } = require("../db/url");
const { decrypt } = require("../utils/encryption");
const { pingDb } = require("../utils/pinger");

async function runPingJob() {
  console.log(`[${new Date().toISOString()}] Starting database ping job...`);

  let totalCount = 0;
  let successCount = 0;
  let failureCount = 0;

  try {
    const urlsData = await getAllUrls();
    totalCount = urlsData.length;
    console.log(`Found ${totalCount} database connection(s) to ping.`);

    for (const dbEntry of urlsData) {
      try {
        const decryptedUrl = decrypt(dbEntry.url);
        const isSuccess = await pingDb(decryptedUrl);

        if (isSuccess) {
          await updateErrorCount(dbEntry.id, 0);
          successCount++;
          console.log(`[Success] Pinged DB ID: ${dbEntry.id}`);
        } else {
          await updateErrorCount(dbEntry.id, 1);
          failureCount++;
          console.warn(`[Failed] DB ID: ${dbEntry.id} incremented error count.`);
        }
      } catch (error) {
        console.error(`[Error] Processing DB ID ${dbEntry.id}:`, error.message);
        await updateErrorCount(dbEntry.id, 1);
        failureCount++;
      }
    }
  } catch (error) {
    console.error("Fatal error during database ping execution:", error);
    process.exit(1);
  } finally {
    try {
      const deletedResult = await deleteUrls();
      if (deletedResult.count > 0) {
        console.log(`Cleaned up ${deletedResult.count} URL(s) exceeding error limit.`);
      }
    } catch (cleanupError) {
      console.error("Error during URL cleanup:", cleanupError.message);
    }
  }

  console.log(
    `[Summary] Completed ping job. Total: ${totalCount}, Success: ${successCount}, Failed: ${failureCount}`
  );
  process.exit(0);
}

runPingJob();
