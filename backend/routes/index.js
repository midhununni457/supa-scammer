const router = require("express").Router();
const { addUrl } = require("../controllers/UrlController");

router.post("/urls", addUrl);

module.exports = router;
