var tableUrl = '/v1/api/admin/welcome/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        title: '欢迎语',
        align: 'center',
        formatter: function (value, row, index) {
            var msg = row.message.replace('\"','&quot;');
            msg = msg.replace('<','&lt;');
            msg = msg.replace('>','&gt;');
            return msg;
        }
    },
    {
        field: '', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var msg = row.message.replace('"','&quot;');
            msg = msg.replace('<','&lt;');
            msg = msg.replace('>','&gt;');
            return '<a class="btn" onclick="delBlockKeyword(\''+row.id+'\',\''+msg+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

var queryTableUrl = '/v1/api/admin/welcome/search';

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
        alert('欢迎语不能为空');
    } else {
        var obj = {
            'word': word
        }
        $.danmuAjax('/v1/api/admin/welcome/save', 'POST','json',obj, function (data) {
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
    if (confirm('确认要删除欢迎语“' + word + '”吗？')) {

         $.danmuAjax('/v1/api/admin/welcome/del/'+id, 'delete','json',null, function (data) {
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