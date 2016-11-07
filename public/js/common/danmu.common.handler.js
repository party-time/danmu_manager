$.ajaxSetup({
    timeout: 3000,
    dataType: 'html',
    //请求成功后触发
    success: function (data) {
        console.log('success invoke!' + data + '<br/>');
    },
    //请求失败遇到异常触发
    error: function (xhr, status, e) {
        console.log('error invoke!' + data + '<br/>');
    },
    //完成请求后触发。即在success或error触发后触发
    complete: function (xhr, status) {
        console.log('complete invoke! status:' + status + '<br/>');
    },
    //发送请求前触发
    beforeSend: function (xhr) {
        //可以设置自定义标头
        xhr.setRequestHeader('Content-Type', 'application/xml;charset=utf-8');
        console.log('beforeSend invoke!' +'<br/>');
    },
})