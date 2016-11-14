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

router.get('/party/add', function(req, res, next) {
  res.render('party/addParty');
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

/**预制弹幕*/
router.get('/predanmu', function(req, res, next) {
  res.render('danmu/predanmu');
});

/**历史弹幕*/
router.get('/historyDanmu', function(req, res, next) {
  res.render('danmu/historyDanmu');
});

/**跳转弹幕审核*/
router.get('/danmuCheck', function(req, res, next) {
  res.render('danmu/danmuCheck');
});




module.exports = router;
