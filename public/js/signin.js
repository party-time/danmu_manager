$(function () {
	
	jQuery.support.placeholder = false;
	test = document.createElement('input');
	if('placeholder' in test) jQuery.support.placeholder = true;


	if (!$.support.placeholder) {
		$('.field').find ('label').show ();
	}

});

var login = function(){
    $.ajax({
        url:"/v1/login",
        type: "post",
        dataType: "json",
        data: {
            name: $('#username').val(),
            password: $('#password').val(),
        }
    }).done(function (data) {
        if (data.result == 200) {
            window.location.href='/';
        } else {
            alert(data.result_msg);
        };
    });
}
