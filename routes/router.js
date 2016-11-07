var express = require('express');
var router = express.Router();

/**跳转到主页*/
router.get('/', function(req, res, next) {
  res.render('party/party', { title: 'Express' });
});
/**跳转到登录页*/
router.get('/login', function(req, res, next) {
  res.render('login');
});

/**跳转到登录页*/
router.get('/user', function(req, res, next) {
  res.render('user/user');
});

/**跳转到活动页面*/
router.get('/party', function(req, res, next) {
  res.render('party/party');
});
/**跳转到活动资源*/
router.get('/partyResource', function(req, res, next) {
  res.render('pary/partyResource');
});
/**跳转弹幕审核*/
router.get('/partyCheck', function(req, res, next) {
  res.render('pary/partyCheck');
});

/**地址管理*/
router.get('/cinema', function(req, res, next) {
  res.render('cinema/cinema');
});

/**屏蔽词管理*/
router.get('/blockword', function(req, res, next) {
  res.render('blockword/blockword');
});

/**定时弹幕管理*/
router.get('/timerDanmu', function(req, res, next) {
  res.render('danmu/timerDanmu');
});

/**预制弹幕
 * 弹幕管理*/
router.get('/predanmu', function(req, res, next) {
  res.render('danmu/predanmu');
});

router.get('/historyDanmu', function(req, res, next) {
  res.render('danmu/historyDanmu');
});




module.exports = router;
