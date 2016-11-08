
$('[name="testDanmuModel"]').bootstrapSwitch({
    onText: "启动",
    offText: "停止",
    onColor: "success",
    offColor: "danger",
    size: "small",
    onSwitchChange: function (event, state) {
        if (state == true) {
            $(this).val("1");
        } else {
            $(this).val("2");
        }
    }
})

$('[name="preDanmuModel"]').bootstrapSwitch({
    onText: "启动",
    offText: "停止",
    onColor: "success",
    offColor: "danger",
    size: "small",
    onSwitchChange: function (event, state) {
        if (state == true) {
            $(this).val("1");
        } else {
            $(this).val("2");
        }
    }
})

$(".multiSelect").select2();

//$('[name="testDanmuModel"]').bootstrapSwitch('disabled', true);
