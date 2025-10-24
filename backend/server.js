const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const cron = require("node-cron");
const { pingDb } = require("./utils/pinger");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily ping...");
  try {
    const res = await fetch("http://localhost:3001/api/urls");
    const data = await res.json();
    dbs = data.map((item) => item.url);

    for (const db of dbs) {
        await pingDb(db);
    }
  } catch (error) {
    console.error("Error during daily ping:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
