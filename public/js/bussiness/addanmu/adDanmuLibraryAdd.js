var url_pre = "/v1/api/admin/adDanmuLibrary";


var libraryId;

var saveAdDanmuLibrary = function(){
    var name = $("#adDanmuLibraryName").val();
    if(name==null ||  name==""){
        alert("请收入名称！");
        return;
    }
    $.danmuAjax(url_pre+'/save', 'POST','json',{"name":name,"libraryId":libraryId}, function (data) {
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
var getAllDanmuLibrary = function () {
    var url = location.href.substring(location.href.indexOf("?") + 1);
    var index = url.indexOf('=');
    if(index>=0){
        libraryId = url.substr( index+ 1);
    }
    obj = {
        id:libraryId
    }
    $.danmuAjax(url_pre+'/find', 'GET', 'json', obj, function (data) {
        if (data.result == 200) {
            //window.location.href='/adDanmuLibrary';
            if(data.data!=null){
                $("#adDanmuLibraryName").val(data.data.name)
            }
        } else {
        }
    });
}

getAllDanmuLibrary();


