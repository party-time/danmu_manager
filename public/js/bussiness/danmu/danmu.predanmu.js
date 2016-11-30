
var preDanmuPageNo = 0;

var getAllDanmuLibrary = function(id) {
    $('#selectedDl').empty();
    $.danmuAjax('/v1/api/admin/getAllDanmuLibrary', 'GET','json',null, function (data) {
      if (data.result == 200) {
          console.log(data);
           $('#selectedDl').append('<option value="0">创建新库</option>');
           for(var i=0;i<data.data.length;i++){
                var dl = data.data[i];
                $('#selectedDl').append('<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>');
           }
           if( null != id){
                 $('#selectedDl').val(id);
           }
      }else{
         alert('获取失败')
      }
    }, function (data) {
        console.log(data);
    });
}

var paginationCount = function(pageNumber,pageSize,totalCount,idName){
  pageNumber = parseInt(pageNumber);
  var lastStr = '';
  if(pageNumber==1){
     lastStr = '';
  }else{
     var lastNo = pageNumber-1;
     lastStr = '<a style="margin-left:10px;" onclick="getDanmuPage('+lastNo+')" href="javascript:void(0)">&laquo;上一页</a>';
  }

  var nextStr = '';
  var totalPageNo =  parseInt((totalCount  + pageSize -1) / pageSize);
  if(totalPageNo == 1){
    return '';
  }

  if(totalPageNo > pageNumber){
    var nextNo = pageNumber+1;
    nextStr= '<a style="margin-left:10px;" onclick="getDanmuPage('+nextNo+')" href="javascript:void(0)">下一页&raquo;</a>';
  }

  var pageStr = '<div class="diyPagination" style="float:left;">'+lastStr+'<span style="margin-left:10px;">第'+pageNumber+'页</span>'+nextStr+
     '<a style="margin-left:10px;" onclick="gotoDanmuPage(\''+idName+'\')">跳转</a><input type="text" id="'+idName+'" style="width:25px;"><span style="margin-left:10px;">共<span>'+totalPageNo+'</span>页</span></div>';

  return pageStr;
}

var gotoDanmuPage = function(idName){
    var gotoPageNo = $('#'+idName).val();
    if(gotoPageNo != ''){
        getDanmuPage(gotoPageNo);
    }else{
        alert('请输入页数');
    }

}

var getDanmuPage = function(pageNumber){
    var danmuMsg = $('#historyDmMsg').val();
    if( null == pageNumber){
        pageNumber = 1;
    }
    var obj = null;
    if( '' == danmuMsg){
        obj ={
            pageNumber:pageNumber,
            pageSize:20
        }
    }else{
        obj ={
            msg:danmuMsg,
            pageNumber:pageNumber,
            pageSize:20
        }
    }

    $('#historyDm').empty();
    $('#historyDm').parent().find('.diyPagination').remove();
    $.danmuAjax('/v1/api/admin/historyDMList', 'GET','json',obj, function (data) {
          console.log(data);
          for(var i=0;i<data.rows.length;i++){
            $('#historyDm').append('<li class="list-group-item" ><span style="border: solid 2px #f5f5f5;width:80%;float:left;background-color:'+data.rows[i].color+'">'+data.rows[i].msg+'</span><span style="float:left;border:solid 2px #FFFFFF;"><a href="javascript:void(0)" preDanmuId="'+data.rows[i].id+'" onclick="addPreDanmu(this)" class="addPreDanmu">添加</a></span></li>');
          }
          $('#historyDm').after(paginationCount(obj.pageNumber,obj.pageSize,data.total,'danmuGoto'));
    }, function (data) {
        console.log(data);
    });
}

var dlPaginationCount = function(pageNumber,pageSize,totalCount){
    if(totalCount==0){
        return '';
    }
   pageNumber = parseInt(pageNumber);
  var lastStr = '';
  if(pageNumber==1){
     lastStr = '';
  }else{
     var lastNo = pageNumber-1;
     lastStr = '<a style="margin-left:10px;" onclick="getDanmuLibraryPage('+lastNo+')" href="javascript:void(0)">&laquo;上一页</a>';
  }

  var nextStr = '';
  var totalPageNo =  parseInt((totalCount  + pageSize -1) / pageSize);
  if(totalPageNo == 1){
    return '';
  }

  if(totalPageNo > pageNumber){
    var nextNo = pageNumber+1;
    nextStr= '<a style="margin-left:10px;" onclick="getDanmuLibraryPage('+nextNo+')" href="javascript:void(0)">下一页&raquo;</a>';
  }

  var pageStr = '<div class="diyPagination" style="float:left;">'+lastStr+'<span style="margin-left:10px;">第'+pageNumber+'页</span>'+nextStr+
     '<a style="margin-left:10px;" onclick="gotoDlDanmuPage()">跳转至</a><input type="text" id="dlgoto" style="width:25px;"><span style="margin-left:10px;">共<span>'+totalPageNo+'</span>页</span></div>';

  return pageStr;
}

var gotoDlDanmuPage = function(){
    var gotoPageNo = $('#dlgoto').val();
    if(gotoPageNo != ''){
        getDanmuLibraryPage(gotoPageNo);
    }else{
        alert('请输入页数');
    }

}

var getDanmuLibraryPage = function(pageNo){
    var preDmMsg = $('#preDmMsg').val();
    var dlId = $('#selectedDl').val();
    if( dlId == 0){
        $('#dlDm').empty();
        return;
    }
    $('#dlDm').empty();
    $('#dlDm').parent().find('.diyPagination').remove();
    if(!pageNo){
        pageNo = 1;
    }
     preDanmuPageNo = pageNo;
    var obj = null;
    if( '' == preDmMsg){
        obj = {
              dlId:dlId,
              pageNo:pageNo,
              pageSize:20
          }
    }else{
        obj = {
              dlId:dlId,
              pageNo:pageNo,
              pageSize:20,
              msg:preDmMsg
          }
    }

    $.danmuAjax('/v1/api/admin/preDMList', 'GET','json',obj, function (data) {
          console.log(data);
          for(var i=0;i<data.data.content.length;i++){
            $('#dlDm').append('<li class="list-group-item" ><span style="border: solid 2px #f5f5f5;width:80%;float:left;background-color:'+data.data.content[i].color+'">'+data.data.content[i].msg+'</span><span style="float:left;border:solid 2px #FFFFFF;"><a href="javascript:void(0)" onclick="deletePreDanmu(\''+data.data.content[i].id+'\')">删除</a></span></li>');

          }
          $('#dlDm').after(dlPaginationCount(obj.pageNo,obj.pageSize,data.data.totalElements));
          $('#preCount').html('('+data.data.totalElements+')');
    }, function (data) {
        console.log(data);
    });
}
var saveDanmuLibrary = function(){
    var n = $('#dlName').val();

    if( null == n || '' == n ){
        alert('请填写一个弹幕库的名称');
        return false;
    }
    if('创建新库' == n){
        alert('该名称不能使用');
        return false;
    }

    if( n.length > 10){
        alert('弹幕库名称过长');
         return false;
    }
    var obj={
        name:n
    }
    $.danmuAjax('/v1/api/admin/saveDanmuLibrary', 'GET','json',obj, function (data) {
          getAllDanmuLibrary(data.data.id);
          $('#dlName').val('');
    }, function (data) {
        console.log(data);
    });

}

 /**
 * 删除预制弹幕
 * @param preDanmuId
 */
var deletePreDanmu = function (preDanmuId) {
    var obj ={
        dmId:preDanmuId
    };
    $.danmuAjax('/v1/api/admin/deletePreDm', 'GET','json',obj, function (data) {
        getDanmuLibraryPage(preDanmuPageNo);
    }, function (data) {
        console.log(data);
    });

}

 /**
     * 添加预制弹幕
     * @param id
     */
var addPreDanmu = function (obj) {
    if( $('#selectedDl').val() == 0 ){
        alert('请先选择一个弹幕库');
        return false;
    }

    var id = $(obj).attr('preDanmuId');
    $('.addPreDanmu').removeAttr('href');
    $('.addPreDanmu').removeAttr('onclick');
    var obj={
        dmId:id,
        dlId:$('#selectedDl').val()
    }
    $.danmuAjax('/v1/api/admin/addPreDm', 'GET','json',obj, function (data) {
        getDanmuLibraryPage(1);
        $('.addPreDanmu').attr('href','javascript:void(0)');
        $('.addPreDanmu').attr('onclick','addPreDanmu(this)');
    }, function (data) {
        console.log(data);
    });
};

var initColor = function () {

    $.danmuAjax('/v1/api/admin/colors', 'GET','json',null, function (data) {
        var colorHtml = '';
        for(var i=0;i<data.data.danmuColors.length;i++){
            colorHtml += '<a class="shortcut" href="javascript:void(0)" style="background:'+data.data.danmuColors[i]+'" onclick="setEx(\''+data.data.danmuColors[i]+'\')"><span class="shortcut-label">'+data.data.danmuColors[i]+'</span></a>';
        }
        $('#colors').html(colorHtml);
    }, function (data) {
        console.log(data);
    });

}

var g_color='';

var setEx = function (color) {
    g_color = color;
    var style = $('#sendDmMsg').attr('style');
    $('#sendDmMsg').css('background',color);
}

var addNewDanmu = function () {
    if (g_color == null || g_color == '') {
        alert('请设置颜色');
        return;
    }
    var danmuMsg = $('#sendDmMsg').val();
    if (danmuMsg == null || danmuMsg == '') {
        alert('请填写弹幕');
        return;
    }
    if($('#selectedDl').val() ==0){
        alert("请选择一个弹幕库");
        return;
    }

    var obj={
         color: g_color,
         msg:danmuMsg,
         dlId:$('#selectedDl').val()
    }
    $.danmuAjax('/v1/api/admin/addNewDanmu', 'POST','json',obj, function (data) {
        getDanmuLibraryPage(1);
    }, function (data) {
        console.log(data);
    });

}

var delDanmuLibrary = function () {

        if($('#selectedDl').val() ==0){
            alert("请选择一个弹幕库");
            return;
        }
       if(confirm('确定要删除'+$('#selectedDl  option:selected').text()+'吗？')){
        var obj={
             id:$('#selectedDl').val()
        }
        $.danmuAjax('/v1/api/admin/delDanmuLibrary', 'GET','json',obj, function (data) {
            $('#dlDm').empty();
            $('#dlDm').parent().find('.diyPagination').remove();
            getAllDanmuLibrary();
            $('#selectedDl').val(0);
        }, function (data) {
            console.log(data);
        });
     }

}

initColor();
getAllDanmuLibrary();
getDanmuPage(1);
