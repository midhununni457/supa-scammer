const router = require("express").Router();
const { addUrl, ping } = require("../controllers/UrlController");

router.post("/urls", addUrl);
router.get("/ping", ping);

module.exports = router;
