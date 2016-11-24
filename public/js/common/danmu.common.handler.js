$.ajaxSetup({
    timeout: 10000,
    dataType: 'html',
    //请求成功后触发
    success: function (data) {
        console.log('success invoke!' + data + '<br/>');
    },
    //请求失败遇到异常触发
    error: function (xhr, status, e) {
        console.log('error invoke!' + e + '<br/>');
    },
    //完成请求后触发。即在success或error触发后触发
    complete: function (xhr, status) {
        console.log('complete invoke! status:' + status + '<br/>');
        if (xhr.status == 444) {
            window.location = '/login';
            return;
        }
    },
    //发送请求前触发
    beforeSend: function (xhr) {
        //可以设置自定义标头
        //xhr.setRequestHeader('Content-Type', 'application/xml;charset=utf-8');
        console.log('beforeSend invoke!' +'<br/>');
    },
})

var setAdminNick = function(){
    var nick = $.cookie('nick');
    var adminNickHtml = '<a href="#" class="dropdown-toggle" data-toggle="dropdown" > <i class="icon-user"></i>'+nick+
   '<b class="caret"></b> </a><ul class="dropdown-menu"><li><a href="javascript:;">修改密码</a></li><li><a href="javascript:;" onclick="logout()">登出</a></li></ul>';
    $('.adminNick').html(adminNickHtml);
}

var logout = function(){
    $.ajax({
            url:"/v1/logout",
            type: "get",
            dataType: "json",
    }).done(function (data) {
        if (data.result == 200) {
            window.location.href='/login';
        } else {
            alert(data.result_msg);
        };
    });

}

var navbarSelect = function(){
    var url = window.location.href;
    if( url.indexOf('/party')!=-1){
        $('.icon-gamepad').parent().parent().attr('class','active');
    }
    if( url.indexOf('/cinema')!=-1){
        $('.icon-film').parent().parent().attr('class','active');
    }
    if( url.indexOf('/user')!=-1){
        $('.icon-user').parent().parent().attr('class','active');
    }
    if( url.indexOf('/blockword')!=-1){
        $('.icon-bar-chart').parent().parent().attr('class','active');
    }
    if( url.indexOf('/predanmu')!=-1){
        $('.icon-list-alt').parent().parent().attr('class','active');
    }
    if( url.indexOf('/wechat')!=-1){
        $('.icon-camera').parent().parent().attr('class','active');
    }

}

