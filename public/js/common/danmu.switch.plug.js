(function ($) {
    $.initSwitch = function (id, changeHandler) {
        $('#' + id).bootstrapSwitch({
            onText: "启动",
            offText: "关闭",
            onColor: "success",
            offColor: "danger",
            size: "small",
            onSwitchChange: changeHandler
        });
    }
})(jQuery);