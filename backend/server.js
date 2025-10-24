const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const { startDailyPingJob } = require("./utils/pinger");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

startDailyPingJob();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
