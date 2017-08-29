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
router.get('/party/resource', function(req, res, next) {
  res.render('party/resource');
});

router.get('/party/add', function(req, res, next) {
  res.render('party/addParty');
});


router.get('/party/update', function(req, res, next) {
  res.render('party/updateParty');
});


/**地址管理*/
router.get('/cinema', function(req, res, next) {
  res.render('cinema/cinema');
});

router.get('/cinema/add', function(req, res, next) {
  res.render('cinema/addAddress');
});

router.get('/cinema/update', function(req, res, next) {
  res.render('cinema/addAddress');
});

/**屏蔽词管理*/
router.get('/blockword', function(req, res, next) {
  res.render('blockword/blockword');
});

router.get('/wechat', function(req, res, next) {
  res.render('wechat/wechatReply');
});


/**预制弹幕*/
router.get('/predanmu', function(req, res, next) {
  res.render('danmu/predanmu');
});


/**定时弹幕管理*/
router.get('/party/timerDanmu', function(req, res, next) {
  res.render('danmu/timerDanmu');
});


/**历史弹幕*/
router.get('/party/historyDanmu', function(req, res, next) {
  res.render('danmu/historyDanmu');
});

/**跳转弹幕审核*/
router.get('/party/danmuCheck', function(req, res, next) {
  res.render('danmu/danmuCheck');
});
/**跳转弹幕审核*/
router.get('/film/danmuCheck', function(req, res, next) {
    res.render('danmu/filmDanmuCheck');
});


/**管理员*/
router.get('/adminmanager', function(req, res, next) {
  res.render('adminmanager/index');
});

/**打赏**/
router.get('/reward', function(req, res, next) {
  res.render('reward/reward');
});

router.get('/adDanmuLibrary', function(req, res, next) {
    res.render('addanmu/adDanmuLibrary');
});

router.get('/adDanmuLibrary/add', function(req, res, next) {
    res.render('addanmu/adDanmuLibraryAdd');
});

router.get('/adDanmuLibrary/edit', function(req, res, next) {
    res.render('addanmu/adDanmu');
});

router.get('/version', function(req, res, next) {
    res.render('version/version');
});

router.get('/param', function(req, res, next) {
    res.render('param/param');
});

router.get('/danmucmd', function(req, res, next) {
    res.render('danmucmd/danmucmd');
});

router.get('/h5temp', function(req, res, next) {
    res.render('h5temp/h5temp');
});

router.get('/monitor', function(req, res, next) {
    res.render('monitor/monitor');
});

router.get('/shop', function(req, res, next) {
    res.render('shop/shop');
});

router.get('/shop/detail', function(req, res, next) {
    res.render('shop/detail');
});


router.get('/shopManager', function(req, res, next) {
    res.render('shopManager/item');
});

router.get('/shopManager/add', function(req, res, next) {
    res.render('shopManager/addItem');
});

router.get('/shopManager/update', function(req, res, next) {
    res.render('shopManager/updateItem');
});

router.get('/shopManager/uploadImage', function(req, res, next) {
    res.render('shopManager/uploadImage');
});

router.get('/shopManager/cms', function(req, res, next) {
    res.render('shopManager/cms');
});


router.get('/order', function(req, res, next) {
    res.render('order/order');
});

router.get('/report', function(req, res, next) {
    res.render('report/report');
});


module.exports = router;
