var tableUrl = '/v1/api/admin/wechatmanager/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'id',
        title: '微信编号',
        align: 'center',
    },
    {
        title: '微信头像',
        align: 'center',
        width:'30%',
        formatter: function (value, row, index) {
            return '<img width="30%" src="'+row.imgUrl+'" />';
        }
    },
    {
        field: 'nick',
        title: '微信昵称',
        align: 'center'
    },
    {
        title: '性别',
        align: 'center',
        formatter: function (value, row, index) {
            if(row.sex == 1){
                return '男';
            }else if(row.sex == 2){
                 return '女';
            }else{
                return '未知';
            }

        }
    },
    {
        title: '关注状态',
        align: 'center',
        formatter: function (value, row, index) {
            if(row.subscribeState == 0){
                return '关注中';
            }else if(row.subscribeState == 1){
                 return '取消关注';
            }else{
                return '未知';
            }
        }
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="delUser(\''+row.id+'\',\''+row.nick+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};


var searchNick = function(){
    var nick = $("#searchNick").val();
    if( '' != nick){
        quaryObject = {
            nick:nick,
            pageSize:20
        }
        $.initTable('tableList', columnsArray, quaryObject, tableUrl);
    }
}

var delUser = function(id,nick){
    if (confirm('确认要删除用户“' + nick + '”吗？')) {

             $.danmuAjax('/v1/api/admin/wechatmanager/del?id='+id, 'GET','json',null, function (data) {
              if (data.result == 200) {
                  console.log(data);

                  var nick = $("#searchNick").val();
                  if( '' != nick){
                       searchNick();
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
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);