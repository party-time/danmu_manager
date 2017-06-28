var returnList = function(){
    window.location.href="/shopManager";
}

var g_item_id;

var findById = function(){
    var url = location.href;
    if(url.indexOf('id=')!=-1){
        var id = url.substr(url.indexOf('=')+1);
        g_item_id = id;
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/item/findImg', 'GET','json',obj, function (data) {
            if(data.result == 200){
                if( data.data ){
                    if(data.data.cover){
                        var imgUrl = _baseImageUrl+data.data.cover.fileUrl;
                        var imgStr = '<img src="'+imgUrl+'" />';
                        $('#showCoverImg').html(imgStr);
                    }

                    if(data.data.imageList){
                        for(var i=0;i<data.data.imageList.length;i++){
                            var imgUrl = _baseImageUrl+data.data.imageList[i].fileUrl;
                            var imgStr = '<img src="'+imgUrl+'" />';
                            $('#showShopImg').append(imgStr);
                        }
                    }
                }
            }else{
                if(data.result_msg){
                    alert(data.result_msg)
                }else{
                    alert('查询失败')
                }
            }
        }, function (data) {
            console.log(data);
        });
    }
}

var uploadCover = function(){
    var file = document.querySelector('#coverImg').files[0];
    var fd = new FormData();
    fd.append('file', file);
    fd.append('itemId',g_item_id);
    $.ajax({
             type: 'POST',
             url: '/v1/api/admin/item/uploadCoverImage',
             data: fd,
             processData:false,
             dataType: 'json',
             contentType:false,
             success: function(data){
                if(data.result == 200){
                    location.reload();
                    alert("上传成功");
                }else{
                    alert("上传失败");
                }
             },
             error: function(data){

             }
    });
}

var uploadImage = function(){
    var file = document.querySelector('#shopImg').files[0];
    var fd = new FormData();
    fd.append('file', file);
    fd.append('itemId',g_item_id);

    $.ajax({
             type: 'POST',
             url: '/v1/api/admin/item/uploadImage',
             data: fd,
             processData:false,
             dataType: 'json',
             contentType:false,
             success: function(data){
                if(data.result == 200){
                    location.reload();
                    alert("上传成功");
                }else{
                    alert("上传失败");
                }
             },
             error: function(data){

             }
    });

}


findById();