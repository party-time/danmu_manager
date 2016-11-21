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
                $('#specialImages').html('<h4>还没有特效图片，可以<a href="#">选择特效图片</a>也可以按照文件名规则上传</h4>');
            }
            if( data.data.specialVideos && data.data.specialVideos.length > 0){
                var specialVideos = data.data.specialVideos;
            }else{
                $('#specialVideos').html('<h4>还没有特效视频，可以<a href="#">选择特效视频</a>也可以按照文件名规则上传</h4>');
            }
        }, function (data) {
            console.log(data);
        });
    }
 }


var openH5 = function(){
    $('#myModalLabel').html('h5背景图片选择');
    var imgHtml = '<div>'+
        '<div style="display:inline;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/h5Background/h5Background.jpg" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%"  src="http://testimages.party-time.cn/upload/1025/h5Background/h5Background.jpg" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/h5Background/h5Background.jpg" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/h5Background/h5Background.jpg" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/h5Background/h5Background.jpg" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/h5Background/h5Background.jpg" /></div>'+
        '</div>';
    $('.modal-body').html(imgHtml);

    $('.modal').css({width:'50%'});
    var footer='<div><a>上一页</a>第10页<a>下一页</a> 共56页</div>'
    $('.modal-footer').html(footer);
    $('#myModal').modal('show');

}

var openExpressions = function(){
    $('#myModalLabel').html('表情图片选择');
    var imgHtml = '<div>'+
        '<div style="display:inline;"><img style="width:14%;" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%"  src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef4680cf2cd006efa5f96.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '</div>'+
        '<div style="display:inline;"><img style="width:14%;" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%"  src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef4680cf2cd006efa5f96.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
        '</div>'+
         '<div style="display:inline;"><img style="width:14%;" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
         '<div style="display:inline;margin-left: 15px;"><img style="width:14%"  src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef4680cf2cd006efa5f96.gif" /></div>'+
         '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
         '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
         '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
         '<div style="display:inline;margin-left: 15px;"><img style="width:14%" src="http://testimages.party-time.cn/upload/1025/bigExpressions/580ef44a0cf2cd006efa5f95.gif" /></div>'+
         '</div>';
    $('.modal-body').html(imgHtml);
    $('.modal').css({width:'50%'});
    var footer='<div><a>上一页</a>第10页<a>下一页</a> 共56页</div>'
    $('.modal-footer').html(footer);
    $('#myModal').modal('show');
}



initPartyResource();