var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
});
router.get('/timerDanmu', function(req, res, next) {
    res.render('danmu/timerDanmu');
});

module.exports = router;
