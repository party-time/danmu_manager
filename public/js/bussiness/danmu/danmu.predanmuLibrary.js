var tableUrl = '/v1/api/admin/preDanmuLibrary/list';
var columnsArray = [
    {
        field: 'name',
        title: '弹幕库名称',
        align: 'center'
    },
    {
        field: 'danmuLibraryId', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var str='';

            str += '<a class="btn btn-primary importDanmu" onclick= "importDanmuFuntion(\''+row.id+'\')">导入弹幕</a> &nbsp;';
            str += '<a class="btn" target="_blank" href="/predanmu?id='+row.id+'&name='+row.name+'">修改预置弹幕</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

            str += '<a class="btn btn-danger" href="#" onclick="delDanmuLibrary(\''+row.name+'\',\''+row.id+'\')">删除</a> &nbsp;';
            return str;
        },
        events:'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20,
    name:$("#dlName").val()
};
$.initTable('tableList', columnsArray, quaryObject, tableUrl);

var searchLibrary = function () {
    var quaryObject = {
        pageSize: 20,
        name:$("#dlName").val()
    };
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
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
        $('#dlName').val('');
        searchLibrary();
    }, function (data) {
        console.log(data);
    });

}

var importDanmuFuntion = function(id){
    if($('#selectedDl').val() ==0){
        alert("请选择一个弹幕库");
        return;
    }
    $("#libraryId").val(id);
    $('#myModal').modal('show');
}

$(".importDanmuButton").click(function(){
    //alert(partyId);
    if ($("#uploadFileId2").val().length > 0) {
        ajaxFileUpload();
    } else {
        alert("请选择文件！");
    }
});

function ajaxFileUpload() {
    $.ajaxFileUpload({
        url: "/v1/api/admin/preDanmu/upload/"+$('#libraryId').val(), //用于文件上传的服务器端请求地址
        secureuri: false, //一般设置为false
        fileElementId: 'uploadFileId2', //文件上传空间的id属性  <input type="file" id="file" name="file" />
        dataType: 'json', //返回值类型 一般设置为json
        type:"post",
        success: function (data,status){
            if(data.result==200){
                alert(data.result_msg);
                $("#uploadFileId2").val('');
                $("#libraryId").val('');
                $('#myModal').modal('hide');
                getDanmuLibraryPage(1);
            }else{
                alert(data.result_msg);
            }
        }
    });
    return false;
}

$(".templetDownButton").click(function () {
    var form=$("<form>");//定义一个form表单
    form.attr("style","display:none");
    form.attr("target","");
    form.attr("method","POST");
    form.attr("action","/v1/api/admin/preDanmu/downloadTemplet");
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交
});


var delDanmuLibrary = function (name,id) {

    if(confirm('亲，您确定要删除'+name+'弹幕库吗？如果删除，无法恢复，请慎重操作！！！')){
        var obj={
            id:id
        }
        $.danmuAjax('/v1/api/admin/delDanmuLibrary', 'GET','json',obj, function (data) {
            searchLibrary();
        }, function (data) {
            console.log(data);
        });
    }

}