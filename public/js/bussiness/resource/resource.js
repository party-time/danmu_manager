var g_partyId = '';
var g_h5bg = '';
var g_h5bg_pageNo = 1;
var g_expressions = [];
var g_expressions_pageNo = 1;
var g_specialImages = [];
var g_specialImages_pageNo = 1;
var g_specialVideos= [];
var g_specialVideos_pageNo = 1;
var g_partyType;
var initPartyResource = function(){
    var url = location.href;

    if( url.indexOf('?') != -1){
        url = url.substr(url.indexOf('?')+1,url.length);
    }
    if(url.indexOf('partyId=')!=-1){
        var partyId = url.substring(url.indexOf('=')+1,url.indexOf('&'));
        g_partyId = partyId;
        var obj = {
            partyId:partyId
        }
        $.danmuAjax('/v1/api/admin/resource/index', 'GET','json',obj, function (data) {

            drawH5Background(data.data.h5BackgroundFile);

            drawExpressions(data.data.expressions);

            drawSpecImages(data.data.specialImages);

            drawSpecVideos(data.data.specialVideos);

        }, function (data) {
            console.log(data);
        });
    }
    if(url.indexOf('type=')!=-1){
        g_partyType = url.substr(url.indexOf('type=')+5);
        if(g_partyType == 0){
            $('#nextUrl').html('完成');
        }else if(g_partyType == 1){
            $('#nextUrl').html('下一步');
        }
    }
 }

 var drawH5Background = function(h5BackgroundFile){
    $('#h5Html').empty();
    if( h5BackgroundFile ){
        g_h5bg = h5BackgroundFile.id;
        var h5url = _baseImageUrl+h5BackgroundFile.fileUrl;
        var html = '<img style="width:30%" src="'+h5url+'"/>';
        $('#h5Html').html(html);
    }else{
        $('#h5Html').html('<h4>还没有H5背景图，可以<a href="#" onclick="openH5()">选择H5背景图</a>也可以按照文件名规则上传</h4>');
    }
 }

 var drawExpressions = function(expressions){
    $('#expressions').empty();
    if( expressions && expressions.length > 0){
        g_expressions = expressions;
        var html = '';
        for(var i=0;i<expressions.length;i++){
            var fileurl = _baseImageUrl+expressions[i].fileUrl+'?v='+Math.random();

            html += '<div style="width:15%; border: 1px solid green;display:inline-block;margin:1ex;">'+
                    '<img style="width:90%" src="'+fileurl+'"/><p style="word-wrap: break-word">'+parseInt(expressions[i].fileSize/1000)+'KB</p>';

            if(expressions[i].smallFileUrl ){

                var smallFileUrl = _baseImageUrl+expressions[i].smallFileUrl+'?v='+Math.random();

                html +='<img style="width:50%;" src="'+smallFileUrl+'" /><p style="word-wrap: break-word">'+parseInt(expressions[i].smallFileSize/1000)+'KB</p>';
            }
            html +='<a class="btn" onclick="delPartyResource(\''+expressions[i].id+'\',1)">删除</a><a class="btn" onclick="openFile(\''+expressions[i].id+'\')">小表情</a></div>';
        }

        $('#expressions').html(html);
    }else{
         $('#expressions').html('<h4>还没有表情，可以<a href="javascript:void(0);" onclick="openExpressions()">选择表情</a>也可以按照文件名规则上传</h4>');
    }

}

var drawSpecImages = function(specialImages){
    g_specialImages = specialImages;
    $('#specialImages').empty();
    if( specialImages && specialImages.length > 0 ){
        var html = '';
        for(var i=0;i<specialImages.length;i++){
            var fileurl = _baseImageUrl+specialImages[i].fileUrl;
            html += '<div style="width:30%; border: 1px solid green;display:inline-block;margin:1ex;">'+
            '<img style="width:100%" src="'+fileurl+'"/><p id="specialImages_'+specialImages[i].id+'"><a href="javascript:void(0);" onclick="clickUpdateName(\''+specialImages[i].id+'\',\''+specialImages[i].resourceName+'\')">'+specialImages[i].resourceName+'</a></p><a href="javascript:void(0);" class="btn" onclick="delPartyResource(\''+specialImages[i].id+'\',2)">删除</a></div>';
        }

        $('#specialImages').html(html);
    }else{
        $('#specialImages').html('<h4>还没有特效图片，可以<a href="javascript:void(0);" onclick="openSpecImages()">选择特效图片</a>也可以按照文件名规则上传</h4>');
    }
}

var drawSpecVideos = function(specialVideos){
    g_specialVideos = specialVideos;
    $('#specialVideos').empty();
    if( specialVideos && specialVideos.length > 0){
        var html = '';
        for(var i=0;i<specialVideos.length;i++){
            var fileurl = _baseImageUrl+specialVideos[i].fileUrl;
            var flashStr = '<embed src="/swf/videoPlayer.swf?videoUrl='+fileurl+'" width="320px" height="180px"></embed>';
            html += '<div style="display:inline-block;margin:1ex;">'+flashStr+'<p id="specialVideos_'+specialVideos[i].id+'"><a href="javascript:void(0);" onclick="clickVideoUpdateName(\''+specialVideos[i].id+'\',\''+specialVideos[i].resourceName+'\')">'+specialVideos[i].resourceName+'</a></p><a href="javascript:void(0);" class="btn" onclick="delPartyResource(\''+specialVideos[i].id+'\',3)">删除</a></div>';
        }
        $('#specialVideos').html(html);
    }else{
        $('#specialVideos').html('<h4>还没有特效视频，可以<a href="javascript:void(0);" onclick="openSpecVideos()">选择特效视频</a>也可以按照文件名规则上传</h4>');
    }
}

var geth5BackgroundPage = function(pageNo){
    g_h5bg_pageNo = pageNo
    $('#flashBody').html('正在加载中......');
    $('#myModal').modal('show');
    var obj={
        fileType:4,
        pageNo:pageNo,
        pageSize:6
    };
    var imgHtml = '<div>';
    $.danmuAjax('/v1/api/admin/resource/page', 'GET','json',obj, function (data) {
        for(var i=0;i<data.rows.length;i++){
            var fileUrl = _baseImageUrl+data.rows[i].fileUrl;
            if( data.rows[i].id == g_h5bg){
                if( i == 0){
                    imgHtml += '<div style="display:inline-block;width:14%;border:1px solid red;"><img  style="width:90%" src="'+fileUrl+'" /><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',0)">删除</a></p></div>';
                }else{
                    imgHtml += '<div style="display:inline-block;margin-left:15px;width:14%;border:1px solid red;"><img style="width:90%"  src="'+fileUrl+'" /><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',0)">删除</a></p></div>';
                }
            }else{
                if( i == 0){
                    imgHtml += '<div style="display:inline-block;width:14%"><a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',4)" ><img  style="width:90%" src="'+fileUrl+'" /></a><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',0)">删除</a></p></div>';
                }else{
                    imgHtml += '<div style="display:inline-block;margin-left: 15px;width:14%"><a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',4)" ><img style="width:90%"  src="'+fileUrl+'" /></a><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',0)">删除</a></p></div>';
                }
            }

        }
        imgHtml += '</div>';
        $('#flashBody').html(imgHtml);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo -1;
        if(pageNo == 1 && totalPageNo > 1){
            footer += '第'+obj.pageNo+'页<a onclick="geth5BackgroundPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo && totalPageNo > 1){
            footer += '<a onclick="geth5BackgroundPage('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else if(totalPageNo ==1 ){
            footer += '第'+obj.pageNo+'页';
        }else{
            footer += '<a onclick="geth5BackgroundPage('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="geth5BackgroundPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('#modalFooter').html(footer);
    }, function (data) {
        console.log(data);
    });
}
var openH5 = function(){
    $('#myModalLabel').html('h5背景图片选择');
    geth5BackgroundPage(1);
}

var getExpressions = function(pageNo){
    g_expressions_pageNo = pageNo;
    $('#flashBody').html('正在加载中......');
    $('#myModal').modal('show');
    var obj={
        fileType:1,
        pageNo:pageNo,
        pageSize:18
    };
    var htmlStr = '';
    $.danmuAjax('/v1/api/admin/resource/page', 'GET','json',obj, function (data) {
        for(var i=0;i<data.rows.length;i++){
            var fileUrl = _baseImageUrl+data.rows[i].fileUrl;
            var isHave = false;
            for( var j=0;j<g_expressions.length;j++){
                if(data.rows[i].id == g_expressions[j].id){
                    isHave = true;
                }
            }
            if( i % 6  == 0){
                htmlStr += '<div>';
                if(isHave){
                    htmlStr += '<div style="display:inline-block;width:14%;border:1px solid red;"><img style="width:90%" src="'+fileUrl+'" /><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',1)">删除</a></p></div>';
                }else{
                    htmlStr += '<div style="display:inline-block;width:14%;"><a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',1)"><img style="width:90%" src="'+fileUrl+'" /></a><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',1)">删除</a></p></div>';
                }

            }else if( i% 6 > 0){
                if(isHave){
                    htmlStr += '<div style="display:inline-block;width:14%;margin-left:15px;border:1px solid red;"><img style="width:90%"  src="'+fileUrl+'" /><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',1)">删除</a></p></div>';
                }else{
                    htmlStr += '<div style="display:inline-block;width:14%;margin-left:15px;"><a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',1)"><img style="width:90%"  src="'+fileUrl+'" /></a><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',1)">删除</a></p></div>';
                }

                if( i%6 == 5){
                    htmlStr += '</div>';
                }
            }
        }
        if(data.rows.length < 18){
            htmlStr += '</div>';
        }
        $('#flashBody').html(htmlStr);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo-1;
        if(pageNo == 1 && totalPageNo > 1){
            footer += '第'+obj.pageNo+'页<a onclick="getExpressions('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo && totalPageNo > 1){
            footer += '<a onclick="getExpressions('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else if(totalPageNo == 1){
            footer += '第'+obj.pageNo+'页';
        }else{
            footer += '<a onclick="getExpressions('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="getExpressions('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('#modalFooter').html(footer);
    }, function (data) {
        console.log(data);
    });
}

var openExpressions = function(){
    $('#myModalLabel').html('表情图片选择');
    getExpressions(1);
}

var getSpecImagesPage = function(pageNo){
    g_specialImages_pageNo = pageNo;
    $('#flashBody').html('正在加载中......');
    $('#myModal').modal('show');
    var obj={
        fileType:2,
        pageNo:pageNo,
        pageSize:6
    };
    var imgHtml = '<div>';
    $.danmuAjax('/v1/api/admin/resource/page', 'GET','json',obj, function (data) {
        for(var i=0;i<data.rows.length;i++){
            var fileUrl = _baseImageUrl+data.rows[i].fileUrl;
            var isHave = false;
            if(g_specialImages){
                for(var j=0;j<g_specialImages.length;j++){
                    if(data.rows[i].id == g_specialImages[j].id){
                        isHave = true;
                    }
                }
            }
            if( i == 0){
                if(isHave){
                    imgHtml += '<div style="display:inline-block;width:14%;border:1px solid red;"><img style="width:90%" src="'+fileUrl+'" /><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',2)">删除</a></p></div>';
                }else{
                    imgHtml += '<div style="display:inline-block;width:14%;"><a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',2)"><img style="width:90%" src="'+fileUrl+'" /></a><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',2)">删除</a></p></div>';
                }
            }else{
                if(isHave){
                    imgHtml += '<div style="display:inline-block;width:14%;border:1px solid red;margin-left: 15px;"><img style="width:90%"  src="'+fileUrl+'" /><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',2)">删除</a></p></div>';
                }else{
                    imgHtml += '<div style="display:inline-block;width:14%;margin-left: 15px;"><a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',2)"><img style="width:90%"  src="'+fileUrl+'" /></a><p style="padding-left:10px"><a href="javascript:void(0);" class="btn" onclick="delResource(\''+data.rows[i].id+'\',2)">删除</a></p></div>';
                }
            }
        }
        imgHtml += '</div>';
        $('#flashBody').html(imgHtml);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo -1;
        if(pageNo == 1 && totalPageNo > 1){
            footer += '第'+obj.pageNo+'页<a onclick="getSpecImagesPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo &&totalPageNo>1){
            footer += '<a onclick="getSpecImagesPage('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else if(totalPageNo == 1){
            footer += '第'+obj.pageNo+'页';
        }else{
            footer += '<a onclick="getSpecImagesPage('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="getSpecImagesPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('#modalFooter').html(footer);
    }, function (data) {
        console.log(data);
    });
}
var openSpecImages = function(){
    $('#myModalLabel').html('特效图片选择');
    getSpecImagesPage(1);
}

var getSpecVideosPage = function(pageNo){
    g_specialVideos_pageNo = pageNo;
    $('#flashBody').html('正在加载中......');
    $('#myModal').modal('show');
    var obj={
        fileType:3,
        pageNo:pageNo,
        pageSize:18,
        resourceName:$('#specVideoName').val()
    };
    var htmlStr = '';
    $.danmuAjax('/v1/api/admin/resource/page', 'GET','json',obj, function (data) {
        for(var i=0;i<data.rows.length;i++){
            var isHave = false;
            if(g_specialVideos){
                for( var j=0;j<g_specialVideos.length;j++){
                    if(data.rows[i].id == g_specialVideos[j].id){
                        isHave = true;
                    }
                }
            }
            if( i % 6  == 0){
                htmlStr += '<div>';
                if(isHave){
                    htmlStr += '<div style="display:inline-block;width:14%;">'+
                    '<span style="background:red;word-wrap:break-word">'+data.rows[i].resourceName+'</span>'+
                    '<p><a class="btn" onclick="delResource(\''+data.rows[i].id+'\',3)">删除</a></p></div>';
                }else{
                    htmlStr += '<div style="display:inline-block;width:14%;">'+
                    '<a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',3)"><span style="background:#f9f6f1;word-wrap:break-word">'+data.rows[i].resourceName+'</span></a>'+
                    '<p><a class="btn" onclick="delResource(\''+data.rows[i].id+'\',3)">删除</a></p></div>';
                }
            }else if( i% 6 > 0){
                if(isHave){
                    htmlStr += '<div style="display:inline-block;margin-left:15px;width:14%;">'+
                    '<span style="background:red;word-wrap:break-word">'+data.rows[i].resourceName+'</span>'+
                    '<p><a class="btn" onclick="delResource(\''+data.rows[i].id+'\',3)">删除</a></p></div>';
                }else{
                    htmlStr += '<div style="display:inline-block;margin-left:15px;width:14%;">'+
                    '<a href="javascript:void(0);" onclick="selectResource(\''+data.rows[i].id+'\',3)"><span style="background:#f9f6f1;word-wrap:break-word">'+data.rows[i].resourceName+'</span></a>'+
                    '<p><a class="btn" onclick="delResource(\''+data.rows[i].id+'\',3)">删除</a></p></div>';
                }

                if( i%6 == 5){
                    htmlStr += '</div>';
                }
            }

        }
        if(data.rows.length < 18){
            htmlStr += '</div>';
        }
        $('#flashBody').html(htmlStr);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo-1;
        if(pageNo == 1 && totalPageNo > 1){
            footer += '第'+obj.pageNo+'页<a onclick="getSpecVideosPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo && totalPageNo > 1){
            footer += '<a onclick="getSpecVideosPage('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else if(totalPageNo == 1){
            footer += '第'+obj.pageNo+'页';
        }else{
            footer += '<a onclick="getSpecVideosPage('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="getSpecVideosPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('#modalFooter').html(footer);
    }, function (data) {
        console.log(data);
    });
}

var openSpecVideos = function(){
    $('#myModalLabel').html('<div><span>特效视频选择</span><input type="text" id="specVideoName"/><a class="btn" onclick="searchSpecVideos()">搜索</a></div>');
    getSpecVideosPage(1);
}

var searchSpecVideos = function(){
    getSpecVideosPage(1);
}

var openUpload = function(){
    var fileUploadUrl = _baseUploadUrl+'/v1/api/admin/resource/upload&partyId='+g_partyId;
    $('#myModalLabel').html('文件上传');
    var flashStr = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="ExternalInterfaceExample" width="600" height="390"'+
                 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"><param name="movie" value="/swf/download.swf?uploadUrl='+fileUploadUrl+'" /><param name="quality" value="high" />';
    flashStr += '<embed src="/swf/videoPlayer.swf?uploadUrl='+fileUploadUrl+'" width="600px" height="390px"  play="true" loop="false" quality="high" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" ></embed></object>';
    $('#flashBody').html(flashStr);
    $('#modalFooter').html('');
    $('#myModal').modal('show');
}



var openFile = function(resourceId){
    $('#hiddenFile').click();
    $('#hiddenFile').attr('resourceId',resourceId);
}

var uploadSmallFile = function(){
    var file = document.querySelector('#hiddenFile').files[0];
     var obj = {
        'file':file,
        'resourceId':$('#hiddenFile').attr('resourceId')
     }
     var fd = new FormData();
     fd.append('file', file);
     fd.append('resourceId',$('#hiddenFile').attr('resourceId'));

      $.ajax({
                 type: 'POST',
                 url: '/v1/api/admin/resource/uploadSmall',
                 data: fd,
                 processData:false,
                 dataType: 'json',
                 contentType:false,
                 success: function(data){
                    if(data.result == 200){
                        getResourceFileType(1);
                        alert("上传成功");
                    }else{
                        alert("上传失败");
                    }
                 },
                 error: function(data){

                 }
             });
}

var delResource = function(resourceId,type){
 if(confirm('确定要删除吗？')){
    var obj = {
        id:resourceId
    }
    $.danmuAjax('/v1/api/admin/resource/delResource', 'GET','json',obj, function (data) {
        if(data.result ==200){
            if(type==0){
                geth5BackgroundPage(1);
            }else if(type==1){
                getExpressions(1);
            }else if(type==2){
                getSpecImagesPage(1);
            }else if(type==3){
                getSpecVideosPage(1);
            }

            alert('删除成功');
        }else{
            alert('删除失败');
        }
    }, function (data) {
        console.log(data);
    });
 }
}


var selectResource = function(resourceId,type){
    var obj = {
        partyId:g_partyId,
        resourceId:resourceId,
        fileType:type
    }
    $.danmuAjax('/v1/api/admin/resource/selectResource', 'GET','json',obj, function (data) {
        if(data.result ==200){

            getResourceFileType(type);
            if(type==4){
                geth5BackgroundPage(g_h5bg_pageNo);
            }else if(type==1){
                getExpressions(g_expressions_pageNo);
            }else if(type == 2 ){
                getSpecImagesPage(g_specialImages_pageNo);
            }else if(type == 3){
                getSpecVideosPage(g_specialVideos_pageNo);
            }

        }else{
            alert('选择失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var delPartyResource = function(resourceId,type){
    if(confirm('确定要删除吗？')){
        var obj = {
            partyId:g_partyId,
            resourceId:resourceId
        }
        $.danmuAjax('/v1/api/admin/resource/delPartyResource', 'GET','json',obj, function (data) {
            if(data.result ==200){
                getResourceFileType(type);
            }else{
                alert('选择失败');
            }
        }, function (data) {
            console.log(data);
        });
    }
}

var getResourceFileType = function(type){
    var obj = {
        partyId:g_partyId,
        fileType:type
    }
    $.danmuAjax('/v1/api/admin/resource/resourceFileList', 'GET','json',obj, function (data) {
        if(data.result ==200){
            if(type == 1){
               drawExpressions(data.data);
            }else if (type == 2){
                 drawSpecImages(data.data);
            }else if(type ==3 ){
                drawSpecVideos(data.data);
            }else if(type==4){
                 drawH5Background(data.data[0]);
            }
        }else{
            alert('选择失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var clickUpdateName = function(id,str){
    var html = '<input id="specImage_text_'+id+'" type="text" style="width:210px;margin-top:3px;margin-left:3px;" placeholder="'+str+'" onblur="cancelUpdateName(\''+id+'\',\''+str+'\',0)"/><a class="btn" style="margin-bottom:6px;padding-left:6px;padding-right:6px;margin-left:2px;" onclick="updateName(\''+id+'\',0)">确定</a>';

    $('#specialImages_'+id).html(html);
    $('#specImage_text_'+id).focus();
}

var cancelUpdateName = function(id,str,type){

    var name = $('#specImage_text_'+id).val();
    var html = '<a href="javascript:void(0);" onclick="clickUpdateName(\''+id+'\',\''+str+'\')">'+str+'</a>';
    if(type==1){
        $('#specialImages_'+id).html(html);
    }else if( '' == name && type==0){
        $('#specialImages_'+id).html(html);
    }

}

var updateName = function(resourceId,type){
    var name = ''
    if(type==0){
        name = $('#specImage_text_'+resourceId).val();
    }else{
        name = $('#specVideo_text_'+resourceId).val();
    }
    if( name == ''){
        alert('名称不能为空');
        return;
    }
    if(name.length > 8){
        alert('名称不能超过8个字符');
        return;
    }
    var obj = {
        resourceId:resourceId,
        resourceName:name
    }
    $.danmuAjax('/v1/api/admin/resource/updateResourceName', 'GET','json',obj, function (data) {
        if(data.result ==200){
            if(type==0){
                cancelUpdateName(resourceId,name,1);
            }else{
                cancelVideoUpdateName(resourceId,name,1);
            }

        }else{
            alert('修改失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var clickVideoUpdateName = function(id,str){
    var html = '<input id="specVideo_text_'+id+'" type="text" style="width:210px;margin-top:3px;margin-left:3px;" placeholder="'+str+'" onblur="cancelVideoUpdateName(\''+id+'\',\''+str+'\',0)"/><a class="btn" style="margin-bottom:6px;padding-left:6px;padding-right:6px;margin-left:2px;" onclick="updateName(\''+id+'\',1)">确定</a>';
    $('#specialVideos_'+id).html(html);
    $('#specVideo_text_'+id).focus();
}

var cancelVideoUpdateName = function(id,str,type){
    var name = $('#specVideo_text_'+id).val();
    var html = '<a href="javascript:void(0);" onclick="clickVideoUpdateName(\''+id+'\',\''+str+'\')">'+str+'</a>';
    if(type==1){
         $('#specialVideos_'+id).html(html);
    }else if( name == '' && type==0){
        $('#specialVideos_'+id).html(html);
    }

}

var lastUrl = function(){
   window.location.href="/party/update?id="+g_partyId;
}

var nextUrl = function(){
    if(g_partyType == 0){
        window.location.href="/party";
    }else if(g_partyType == 1){
        if(g_partyId!=''){
            window.location.href="/party/timerDanmu?partyId="+g_partyId+"&showflg=0";
        }
    }
}

initPartyResource();