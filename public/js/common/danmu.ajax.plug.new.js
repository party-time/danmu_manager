/*!
 * danmu.ajax.plug v1.0.0
 */
(function ($) {
    $.danmuAjax = function (url, method,dataType, data, success, error) {
        $.ajax({
            contentType: "application/json; charset=utf-8",
            type: method,
            url: url,
            data: data,
            dataType: dataType,
            success: success,
            error: error
        });
    }
})(jQuery);