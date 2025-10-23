const router = require('express').Router();
const UrlController = require('../controllers/UrlController');

router.post('/urls', UrlController.addUrl);
router.get('/urls', UrlController.getUrls);

module.exports = router;