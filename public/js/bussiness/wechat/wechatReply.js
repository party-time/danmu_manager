var tableUrl = '/v1/api/admin/wxmessage/page';
var blockwordIndex = 0;
var columnsArray = [
    {
        field: 'words',
        title: '关键词',
        align: 'center'
    },
    {
        field: 'message',
        title: '自动回复内容',
        align: 'center',
        width:'60%'
    },
    {
        field: 'id', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="openReplyWords(\''+row.id+'\',\''+row.words+'\',\''+row.message+'\')">修改</a><a class="btn" onclick="delReplyWords(\''+row.id+'\',\''+row.words+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

var addWechatReply = function(){
    $('#addReplyWords').val($('#replyWords').val());
    $('#myModal').modal('show');
}

var findByWordsLike = function(){
    quaryObject = {
        words:$('#replyWords').val(),
        pageSize: 20
    }
    $.initTable('tableList', columnsArray, quaryObject, tableUrl,tableSuccess);
}

var tableSuccess = function(data){
    if(data.total == 0){
        $('#findReplyBtn').attr('disabled',false);
    }else{
        $('#findReplyBtn').attr('disabled',true);
    }
}

var findByWords = function(){
    var obj = {
        words:$('#addReplyWords').val()
    }
    var test = $.danmuAjax('/v1/api/admin/wxmessage/findByWords', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            if(data.data > 0){
                if(!$('#addReplyWords').parent().children('.help-block').html()){
                    $('#addReplyWords').after('<p class="help-block" style="color:red">关键词不能重复</p>');
                }

            }else{
                 $('#addReplyWords').parent().children('.help-block').remove();

            }
         }
    }, function (data) {
        console.log(data);
    });
}

var saveReplyWords = function(){

    if(''==$('#addReplyWords').val()){
        $('#addReplyWords').after('<p class="help-block" style="color:red">关键词不能为空</p>');
        return;
    }else{
        if($('#addReplyWords').parent().children('.help-block').html()){
         $('#addReplyWords').parent().children('.help-block').remove();
        }
    }
    if('' == g_replyWordsId){
        findByWords();
        if($('#addReplyWords').parent().children('.help-block').html()){
            return;
        }
    }

    if(''==$('#message').val()){
        if(!$('#message').parent().children('.help-block').html()){
            $('#message').after('<p class="help-block" style="color:red">自动回复不能为空</p>');
         }
        return;
    }else{
        if($('#message').parent().children('.help-block').html()){
         $('#message').parent().children('.help-block').remove();
        }
    }
    var postUrl = '';
     var obj = null;
    if( '' == g_replyWordsId){
        postUrl = '/v1/api/admin/wxmessage/save';
        obj = {
                words:$('#addReplyWords').val(),
                message:$('#message').val()
            }
    }else{
        postUrl = '/v1/api/admin/wxmessage/update';
        obj = {
            id:g_replyWordsId,
            words:$('#addReplyWords').val(),
            message:$('#message').val()
        }
    }

    $.danmuAjax(postUrl, 'POST','json',obj, function (data) {
        if(data.result == 200) {
          console.log(data);
          $.initTable('tableList', columnsArray, quaryObject, tableUrl,tableSuccess);
          $('#myModal').modal('hide');
          g_replyWordsId='';
          $('#addReplyWords').val('');
          $('#message').val('');
         }else{
            alert('添加失败');
         }
    }, function (data) {
        console.log(data);
    });
}

var delReplyWords = function(id,name){
    if(confirm('确定要删除'+name+'吗？')){
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/wxmessage/del', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
              $.initTable('tableList', columnsArray, quaryObject, tableUrl,tableSuccess);
             }else{
                alert('删除失败');
             }
        }, function (data) {
            console.log(data);
        });
     }
}

var g_replyWordsId = ''

var openReplyWords = function(id,words,message){
   g_replyWordsId = id;
   $('#addReplyWords').val(words);
   $('#message').val(message);
   $('#myModal').modal('show');

}


//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl,tableSuccess);