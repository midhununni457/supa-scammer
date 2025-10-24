const {Client} = require("pg");

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
        try {
            await client.end();
        } catch (e) {
            console.error("Error closing database connection:", e);
        }
    }
}

module.exports = { pingDb };