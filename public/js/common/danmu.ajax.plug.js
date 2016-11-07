/*!
 * danmu.ajax.plug v1.0.0
 */
(function ($) {
    $.danmuAjax = function (url, method, data, success, error) {
        $.ajax({
            type: method,
            url: url,
            data: data,
            dataType: "json",
            success: success,
            error: error
        });
    }
})(jQuery);