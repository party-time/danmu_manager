var express = require('express');
var router = express.Router();
var path = __dirname;
/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.send('respond with a resource');
    res.render('users/user', {path: path});
});

module.exports = router;
