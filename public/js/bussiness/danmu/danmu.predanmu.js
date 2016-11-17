var getAllDanmuLibrary = function() {
    $.danmuAjax('/v1/api/admin/getAllDanmuLibrary', 'GET','json',null, function (data) {
      if (data.result == 200) {
          console.log(data);
           $('#selectedDl').append('<option value="0">创建新库</option>');
           for(var i=0;i<data.data.length;i++){
                var dl = data.data[i];
                $('#selectedDl').append('<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>');
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
     lastStr = '<a style="margin-left:10px;" onclick="getDanmuPage('+lastNo+')">&laquo;上一页</a>';
  }

  var nextStr = '';
  var totalPageNo =  parseInt((totalCount  + pageSize -1) / pageSize);
  if(totalPageNo == 1){
    return '';
  }

  if(totalPageNo > pageNumber){
    var nextNo = pageNumber+1;
    nextStr= '<a style="margin-left:10px;" onclick="getDanmuPage('+nextNo+')">下一页&raquo;</a>';
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
    var obj ={
        pageNumber:pageNumber,
        pageSize:20
    }
    $('#historyDm').empty();
    $('#historyDm').parent().find('.diyPagination').remove();
    $.danmuAjax('/v1/api/admin/historyDMList', 'GET','json',obj, function (data) {
          console.log(data);
          for(var i=0;i<data.rows.length;i++){
            $('#historyDm').append('<li class="list-group-item" ><span style="border: solid 2px #f5f5f5;width:80%;float:left;background-color:'+data.rows[i].color+'">'+data.rows[i].msg+'</span><span style="float:left;border:solid 2px #FFFFFF;"><a>添加</a></span></li>');
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
     lastStr = '<a style="margin-left:10px;" onclick="getDanmuLibraryPage('+lastNo+')">&laquo;上一页</a>';
  }

  var nextStr = '';
  var totalPageNo =  parseInt((totalCount  + pageSize -1) / pageSize);
  if(totalPageNo == 1){
    return '';
  }

  if(totalPageNo > pageNumber){
    var nextNo = pageNumber+1;
    nextStr= '<a style="margin-left:10px;" onclick="getDanmuLibraryPage('+nextNo+')">下一页&raquo;</a>';
  }

  var pageStr = '<div class="diyPagination">'+lastStr+'<span style="margin-left:10px;">第'+pageNumber+'页</span>'+nextStr+
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
    var obj ={
        dlId:dlId,
        pageNo:pageNo,
        pageSize:20
    }
    $.danmuAjax('/v1/api/admin/preDMList', 'GET','json',obj, function (data) {
          console.log(data);
          for(var i=0;i<data.data.content.length;i++){
            $('#dlDm').append('<li class="list-group-item" style="background-color:'+data.data.content[i].color+'">'+data.data.content[i].msg+'</li><li class="list-delete"><a>删除</a>');

          }
          $('#dlDm').after(dlPaginationCount(obj.pageNo,obj.pageSize,data.data.totalElements));
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
          getAllDanmuLibrary();
    }, function (data) {
        console.log(data);
    });

}



getAllDanmuLibrary();
getDanmuPage(1);
