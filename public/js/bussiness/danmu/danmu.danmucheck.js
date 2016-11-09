$(function () {
    var client;
    //初始化测试弹幕按钮
    $.initSwitch('testDanmuModel', switchHandler);
    //预制弹幕按钮
    $.initSwitch('preDanmuModel', switchHandler);

    function switchHandler(event, state) {
        if (state == true) {
            $(this).val("1");
        } else {
            $(this).val("2");
        }
    }
})();

