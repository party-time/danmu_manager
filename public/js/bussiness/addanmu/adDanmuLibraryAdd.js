var url_pre = "/v1/api/admin/adDanmuLibrary";
var saveAdDanmuLibrary = function(){
    var name = $("#adDanmuLibraryName").val();
    $.danmuAjax(url_pre+'/save', 'POST','json',{"name":name}, function (data) {
        if( data.result == 200){
            window.location.href='/adDanmuLibrary';
        }else{
            if(data.result_msg){
                alert(data.result_msg)
            }else{
                alert('保存失败')
            }

        }

    }, function (data) {
        console.log(data);
    });
}


