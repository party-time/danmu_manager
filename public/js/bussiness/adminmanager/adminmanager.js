var tableUrl = '/v1/api/admin/adminUser/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'nick',
        title: '名称',
        align: 'center'
    },
    {
        field: 'userName',
        title: '账号',
        align: 'center'
    },
    {
        field: 'id', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var str = '<a class="btn" onclick="openUpdateAdminUser(\''+row.id+'\',\''+row.nick+'\',\''+row.userName+'\')">修改</a>';
            str += '<a class="btn" onclick="delAdminUser(\''+row.id+'\',\''+row.nick+'\')">删除</a>';
            return str;
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

var openCreateAdminUser = function(){
    $('#myModalLabel').html('新建账号信息');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
   '<label class="control-label" style="width:50px">名称</label><div class="controls" style="margin-left:60px;">'+
   '<input type="text" class="span4" id="nick" maxlength="6" /></div><br>'+
   '<label class="control-label" style="width:50px">账号</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="userName"  maxlength="10" ></div><br>'+
   '<label class="control-label" style="width:50px">密码</label><div class="controls" style="margin-left:60px;">'+
          '<input type="text" class="span4" id="password" maxlength="10" autocomplete="off">'+
   '</div></div></form>';
    $('.modal-body').html(htmlStr);
    var footerHtml = '<a class="btn btn-primary" onclick="createAdminUser()">保存</a>';
    $('.modal-footer').html(footerHtml);
    $('#myModal').modal('show');
}
var createAdminUser = function(){
    var nick = $('#nick').val();
    var userName = $('#userName').val();
    var password = $('#password').val();
    if( '' == nick){
        alert('姓名不能为空');
        return;
    }
    if( '' == userName){
        alert('账号不能为空');
        return;
    }
    if( '' == password){
        alert('密码不能为空');
        return;
    }

    if(nick.length<2){
        alert('姓名长度要大于2个字符');
        return;
    }
    if( userName.length < 4){
        alert('账号长度要大于4个字符');
        return;
    }
    if( password.length < 6){
        alert('密码长度需要大于6位');
        return;
    }
    var passwordPattern = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
    if( passwordPattern.exec(password)){
        alert('密码中只能为字母数字和特殊英文符号');
        return;
    }

    var obj = {
        nick:nick,
        name:userName,
        password:password
    }

    $.danmuAjax('/v1/api/admin/adminUser/save', 'POST','json',obj, function (data) {
      if (data.result == 200) {
          console.log(data);
          $('#myModal').modal('hide');
          $.initTable('tableList', columnsArray, quaryObject, tableUrl);
          alert('创建成功')
      }else{
         alert('创建失败')
      }
    }, function (data) {
        console.log(data);
    });
}


var openUpdateAdminUser = function(id,nick,userName){
    $('#myModalLabel').html('修改账号信息');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
   '<label class="control-label" style="width:50px">名称</label><div class="controls" style="margin-left:60px;">'+
   '<input type="text" class="span4" id="nick" maxlength="10" value="'+nick+'"/></div><br>'+
   '<label class="control-label" style="width:50px">账号</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="userName"  maxlength="10" value="'+userName+'"></div><br>'+
   '<label class="control-label" style="width:50px">密码</label><div class="controls" style="margin-left:60px;">'+
          '<input type="password" class="span4" id="password" maxlength="10" autocomplete="off">'+
   '</div></div></form>';
    $('.modal-body').html(htmlStr);
    var footerHtml = '<a class="btn btn-primary" onclick="updateAdminUser(\''+id+'\')">修改</a>';
    $('.modal-footer').html(footerHtml);
    $('#myModal').modal('show');
}



var updateAdminUser = function(id){
    var nick = $('#nick').val();
    var userName = $('#userName').val();
    var password = $('#password').val();

    var nick = $('#nick').val();
    var userName = $('#userName').val();
    var password = $('#password').val();
    if( '' == nick){
        alert('姓名不能为空');
        return;
    }
    if( '' == userName){
        alert('账号不能为空');
        return;
    }
    if( '' == password){
        alert('密码不能为空');
        return;
    }

    if(nick.length<2){
        alert('姓名长度要大于2个字符');
        return;
    }
    if( userName.length < 4){
        alert('账号长度要大于4个字符');
        return;
    }
    if( password.length < 6){
        alert('密码长度需要大于6位');
        return;
    }
    var passwordPattern = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
    if( passwordPattern.exec(password)){
        alert('密码中只能为字母数字和特殊英文符号');
        return;
    }
    var obj = {
        id:id,
        nick:nick,
        name:userName,
        password:password
    }
    $.danmuAjax('/v1/api/admin/adminUser/update', 'POST','json',obj, function (data) {
      if (data.result == 200) {
          console.log(data);
          $('#myModal').modal('hide');
          $.initTable('tableList', columnsArray, quaryObject, tableUrl);
          alert('更新成功')
      }else{
         alert('更新失败')
      }
    }, function (data) {
        console.log(data);
    });
}

var delAdminUser = function(id,nick){
    if (confirm('确认要删除管理员“' + nick + '”吗？')) {

         $.danmuAjax('/v1/api/admin/adminUser/del?id='+id, 'GET','json',null, function (data) {
          if (data.result == 200) {
              console.log(data);
              $.initTable('tableList', columnsArray, quaryObject, tableUrl);
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