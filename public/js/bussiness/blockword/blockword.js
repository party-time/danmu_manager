var tableUrl = '/v1/api/admin/blockKeywords';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'word',
        title: '屏蔽词',
        align: 'center'
    },
    {
        field: '', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="delBlockKeyword(\''+row.id+'\',\''+row.word+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

var queryTableUrl = '/v1/api/admin/blockKeywords/find';

var findWordLike = function(){
    var word = $('#blockword').val();
    if( word != ''){
        var quaryTableObject = {
            word:word,
            pageSize: 20
        };
        $.initTable('tableList', columnsArray, quaryTableObject, queryTableUrl);
    }else{
        $.initTable('tableList', columnsArray, quaryObject, tableUrl);
    }
}

var addBlockKeyword = function () {
    var word = $('#blockword').val();
    if (''==word) {
        alert('屏蔽词不能为空');
    } else {
        var obj = {
            'word': word
        }
        $.danmuAjax('/v1/api/admin/blockKeywords', 'POST','json',obj, function (data) {
          if (data.result == 200) {
              console.log(data);
              $.initTable('tableList', columnsArray, quaryObject, tableUrl);
              $('#blockword').val('');
          }else{
             alert('添加失败')
          }
        }, function (data) {
            console.log(data);
        });
    }
};

var delBlockKeyword = function (id, word) {
    if (confirm('确认要删除屏蔽词“' + word + '”吗？')) {

         $.danmuAjax('/v1/api/admin/blockKeywords/'+id, 'delete','json',null, function (data) {
          if (data.result == 200) {
              console.log(data);
              if('' !=  $('#blockword').val()){
                 var quaryTableObject = {
                     word:$('#blockword').val(),
                     pageSize: 30
                 };
                 $.initTable('tableList', columnsArray, quaryTableObject, queryTableUrl);
              }else{
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
              }
          }else{
             alert('删除失败')
          }
        }, function (data) {
            console.log(data);
        });
    }
};

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);