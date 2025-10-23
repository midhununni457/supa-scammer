const {Client} = require("pg");

async function pingDb(connString) {
    const client = new Client({
        connectionString: connString,
    });
    try {
        await client.connect();
        await client.query("SELECT 1");
        console.log("Database ping successful");
    } catch (error) {
        console.error("Database ping failed:", error);
    } finally {
        await client.end();
    }
}

module.exports = { pingDb };