var g_partyId = '';
var initPartyResource = function(){
    var url = location.href;
    if(url.indexOf('partyId=')!=-1){
        var partyId = url.substr(url.indexOf('=')+1);
        g_partyId = partyId;
        var obj = {
            partyId:partyId
        }
        $.danmuAjax('/v1/api/admin/resource/index', 'GET','json',obj, function (data) {
            if( data.data.h5Background && data.data.h5Background.length > 0){
                var h5url = data.data.h5Background[0].fileUrl;
                var html = ''
                $('#h5Html').html();
            }else{
                $('#h5Html').html('<h4>还没有H5背景图，可以<a href="#" onclick="openH5()">选择H5背景图</a>也可以按照文件名规则上传</h4>');
            }
            if( data.data.expressions && data.data.expressions.length > 0){
                var bigExpressions = data.data.expressions;
                $('#expressions').html();
            }else{
                 $('#expressions').html('<h4>还没有表情，可以<a href="#" onclick="openExpressions()">选择表情</a>也可以按照文件名规则上传</h4>');
            }
            if( data.data.smallExpressions && data.data.smallExpressions.length > 0){
                var smallExpressions = data.data.smallExpressions;
            }
            if( data.data.specialImages && data.data.specialImages.length > 0 ){
                var specialImages = data.data.specialImages;
            }else{
                $('#specialImages').html('<h4>还没有特效图片，可以<a href="#" onclick="openSpecImages()">选择特效图片</a>也可以按照文件名规则上传</h4>');
            }
            if( data.data.specialVideos && data.data.specialVideos.length > 0){
                var specialVideos = data.data.specialVideos;
            }else{
                $('#specialVideos').html('<h4>还没有特效视频，可以<a href="#" onclick="openSpecVideos()">选择特效视频</a>也可以按照文件名规则上传</h4>');
            }
        }, function (data) {
            console.log(data);
        });
    }
 }

var geth5BackgroundPage = function(pageNo){
    $('.modal-body').html('正在加载中......');
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
            if( i == 0){
                imgHtml += '<div style="display:inline;"><img style="width:14%" src="'+fileUrl+'" /></div>';
            }else{
                imgHtml += '<div style="display:inline;margin-left: 15px;"><img style="width:14%"  src="'+fileUrl+'" /></div>';
            }
        }
        imgHtml += '</div>';
        $('.modal-body').html(imgHtml);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo -1;
        if(pageNo == 1){
            footer += '第'+obj.pageNo+'页<a onclick="geth5BackgroundPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo){
            footer += '<a onclick="geth5BackgroundPage('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else{
            footer += '<a onclick="geth5BackgroundPage('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="geth5BackgroundPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('.modal-footer').html(footer);
    }, function (data) {
        console.log(data);
    });
}
var openH5 = function(){
    $('#myModalLabel').html('h5背景图片选择');
    geth5BackgroundPage(1);
}

var getExpressions = function(pageNo){
    $('.modal-body').html('正在加载中......');
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
            if( i % 6  == 0){
                htmlStr += '<div>';
                htmlStr += '<div style="display:inline;"><img style="width:14%" src="'+fileUrl+'" /></div>';
            }else if( i% 6 > 0){
                htmlStr += '<div style="display:inline;margin-left: 15px;"><img style="width:14%"  src="'+fileUrl+'" /></div>';
                if( i%6 == 5){
                    htmlStr += '</div>';
                }
            }

        }
        if(data.rows.length < 18){
            htmlStr += '</div>';
        }
        $('.modal-body').html(htmlStr);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo-1;
        if(pageNo == 1){
            footer += '第'+obj.pageNo+'页<a onclick="getExpressions('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo){
            footer += '<a onclick="getExpressions('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else{
            footer += '<a onclick="getExpressions('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="getExpressions('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('.modal-footer').html(footer);
    }, function (data) {
        console.log(data);
    });
}

var openExpressions = function(){
    $('#myModalLabel').html('表情图片选择');
    getExpressions(1);
}

var getSpecImagesPage = function(pageNo){
    $('.modal-body').html('正在加载中......');
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
            if( i == 0){
                imgHtml += '<div style="display:inline;"><img style="width:14%" src="'+fileUrl+'" /></div>';
            }else{
                imgHtml += '<div style="display:inline;margin-left: 15px;"><img style="width:14%"  src="'+fileUrl+'" /></div>';
            }
        }
        imgHtml += '</div>';
        $('.modal-body').html(imgHtml);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo -1;
        if(pageNo == 1){
            footer += '第'+obj.pageNo+'页<a onclick="getSpecImagesPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo){
            footer += '<a onclick="getSpecImagesPage('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else{
            footer += '<a onclick="getSpecImagesPage('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="getSpecImagesPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('.modal-footer').html(footer);
    }, function (data) {
        console.log(data);
    });
}
var openSpecImages = function(){
    $('#myModalLabel').html('特效图片选择');
    getSpecImagesPage(1);
}

var getSpecVideosPage = function(pageNo){
    $('.modal-body').html('正在加载中......');
    $('#myModal').modal('show');
    var obj={
        fileType:3,
        pageNo:pageNo,
        pageSize:18
    };
    var htmlStr = '';
    $.danmuAjax('/v1/api/admin/resource/page', 'GET','json',obj, function (data) {
        for(var i=0;i<data.rows.length;i++){
            if( i % 6  == 0){
                htmlStr += '<div style="text-align: center;">';
                htmlStr += '<a href="#" style="display:inline-block;width:14%;"><span style="background:#f9f6f1;">'+data.rows[i].resourceName+'</span></a>';
            }else if( i% 6 > 0){
                htmlStr += '<a href="#" style="display:inline-block;margin-left:15px;width:14%;"><span style="background:#f9f6f1;">'+data.rows[i].resourceName+'</span></a>';
                if( i%6 == 5){
                    htmlStr += '</div>';
                }
            }

        }
        if(data.rows.length < 18){
            htmlStr += '</div>';
        }
        $('.modal-body').html(htmlStr);
        $('.modal').css({width:'50%'});
        var totalPageNo =  parseInt((data.total  + obj.pageSize -1) / obj.pageSize);
        var footer='<div>';
        var next = pageNo+1;
        var last = pageNo-1;
        if(pageNo == 1){
            footer += '第'+obj.pageNo+'页<a onclick="getSpecVideosPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }else if(pageNo == totalPageNo){
            footer += '<a onclick="getSpecVideosPage('+last+')">上一页</a>第'+obj.pageNo+'页 共'+totalPageNo+'页</div>';
        }else{
            footer += '<a onclick="getSpecVideosPage('+last+')">上一页</a>第'+obj.pageNo+'页<a onclick="getSpecVideosPage('+next+')">下一页</a> 共'+totalPageNo+'页</div>';
        }
        $('.modal-footer').html(footer);
    }, function (data) {
        console.log(data);
    });
}

var openSpecVideos = function(){
    $('#myModalLabel').html('特效视频选择');
    getSpecVideosPage(1);
}

var openUpload = function(){
    var fileUploadUrl = _baseUploadUrl+'/v1/api/admin/resource/h5BackgroundUpload';
    $('#myModalLabel').html('文件上传');
    var flashStr = '<embed src="/swf/download.swf?uploadUrl='+fileUploadUrl+'" width="600px" height="390px"></embed>';
    $('.modal-body').html(flashStr);
    $('#myModal').modal('show');
}


initPartyResource();