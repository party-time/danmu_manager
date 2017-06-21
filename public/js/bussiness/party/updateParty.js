
var _update_partyId;
var _update_partyName;

var findPartyById = function(){
    var url = location.href;
    var partyId = '';
    if(url.indexOf('id=')!=-1){
        partyId = url.substr(url.indexOf('=')+1);
        _update_partyId = partyId;
    }
    if('' != partyId){
        var obj = {
            'partyId': partyId
        }
        $.danmuAjax('/v1/api/admin/party/getUpdateParty', 'GET','json',obj, function (data) {
            if( data.result == 200){
                if(data.data){
                    $('#name').val(data.data.party.name);
                    _update_partyName = data.data.party.name;
                    $('#partyType').val(data.data.party.type);
                    selectMovie();
                    if(data.data.party.type == 1){
                         $('#movieAlias').append("<option value='"+data.data.movieAlias.value+"' selected>"+data.data.movieAlias.name+"</option>");

                         if( null == data.data.party.dmDensity){
                            data.data.party.dmDensity = 5;
                         }
                         $('#dmDensity').val(data.data.party.dmDensity);
                    }else{
                        if( null != data.data.danmuAddressList ){
                            for( var i=0;i<data.data.danmuAddressList.length;i++){
                                var html = '<span class="_s'+data.data.danmuAddressList[i].id+'">'+data.data.danmuAddressList[i].name+'</span><a class="btn _a'+data.data.danmuAddressList[i].id+'" onclick="removeAddress(\''+data.data.danmuAddressList[i].id+'\')" addressId="'+data.data.danmuAddressList[i].id+'" isdb="1" >删除</a>';
                                if( i % 5 == 0){
                                    $('#selectAddress').append('<br>');
                                    $('#selectAddress').append(html);
                                }else{
                                    $('#selectAddress').append(html);
                                }
                            }

                        }
                    }
                    getAllDanmuLibrary(data.data.danmuLibraryId);
                }else{
                    alert('查询失败');
                }
            }
        }, function (data) {
            console.log(data);
        });
    }else{
        alert('partyId不能为空');
    }
}

var getAllDanmuLibrary = function(dmLibraryId) {
    $.danmuAjax('/v1/api/admin/getAllDanmuLibrary', 'GET','json',null, function (data) {
        if (data.result == 200) {
           danmuLibraryList = data.data;
          var dl = {
                 id:'0',
                 name:'选择弹幕库'
              }
           danmuLibraryList.unshift(dl);

           var selectHtml = '<select  style="width: 100px;margin-bottom: 0px;" id="danmuLibraryId">';
           if( null != danmuLibraryList){
               for( var i=0;i<danmuLibraryList.length;i++){
                    if( danmuLibraryList[i].id ==  dmLibraryId){
                        selectHtml += '<option value='+danmuLibraryList[i].id+' selected>'+danmuLibraryList[i].name+'</option>';
                    }else{
                        selectHtml += '<option value='+danmuLibraryList[i].id+'>'+danmuLibraryList[i].name+'</option>';
                    }
               }
           }
           selectHtml += '</select>';

           $('#selectPreDm').html(selectHtml);
        } else {
            alert(data.result_msg);
        };
    }, function (data) {
        console.log(data);
    });
}

var initMovieAlias = function(){
    $.danmuAjax('/v1/api/admin/party/movieAlias', 'GET','json',null, function (data) {
        if( data.result == 200){
            var movieAliasList = data.data;
            for(var i=0;i<movieAliasList.length;i++){
                $('#movieAlias').append("<option value='"+movieAliasList[i].value+"'>"+movieAliasList[i].name+"</option>");
            }
        }
    }, function (data) {
        console.log(data);
    });
}

var selectMovie = function(){
    var partyType = $('#partyType').val();
    if(partyType == 0){
        $('#movieTable').hide();
        $('#partyTable').show();
        $('#selectAddressTable').show();
    }else{
        $('#movieTable').show();
        $('#partyTable').hide();
        $('#selectAddressTable').hide();
    }
}

var openAddress = function(){
    var aList = $('#selectAddress').children('a');
    var addressIds = '';
    if( aList && aList.length > 0){
        for(var i=0;i<aList.length;i++){
            addressIds += $(aList[i]).attr('addressId');
            if( i < aList.length-1){
                addressIds += ',';
            }
        }
    }
    var addressTableUrl = '/v1/api/admin/address/queryAll';
    var addressQueryObject = {
        addressIds:addressIds,
        pageSize:6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="selectAddress(\''+row.id+'\',\''+row.name+'\')">选择</a>';
           }
        }
    ];

    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    $('#myModalLabel').html('场地管理');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

var selectAddress = function(id,name){
    var html = '<span class="_s'+id+'">'+name+'</span><a class="btn _a'+id+'" onclick="removeAddress(\''+id+'\')" addressId="'+id+'">删除</a>';
    var spanList = $('#selectAddress').children('span');
    if(spanList.length % 5 == 0){
        $('#selectAddress').append('<br>');
        $('#selectAddress').append(html);
    }else{
        $('#selectAddress').append(html);
    }
    openAddress();

}

var removeAddress = function(id){
    var isDb = $('.btn._a'+id).attr('isdb');
    if( null != isDb){
        var obj = {
            partyId:_update_partyId,
            addressId:id
        }
        $.danmuAjax('/v1/api/admin/partyAddressRelation/delByPartyIdAndAddressId', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
              alert('删除成功');
             }else{
                alert('删除失败');
             }
        }, function (data) {
            console.log(data);
        });
    }
    $('._s'+id).remove();
    $('.btn._a'+id).remove();
    var spanList = $('#selectAddress').children('span');
    if(spanList.length ==0){
        $('#selectAddress').empty();
    }
}

var findPartyByName = function(){
    var name = $('#name').val();
    if('' != name){
        if( name != _update_partyName){
            var obj = {
                'name': name
            }
            $.danmuAjax('/v1/api/admin/party/name', 'GET','json',obj, function (data) {
                if( data.result == 200){
                    if(data.data){
                        if(!$('#name').parent().children('.help-block').html()){
                            $('#name').after('<p class="help-block" style="color:red">活动名称重复</p>');
                        }
                        $('#saveParty').attr('disabled',true);
                    }else{
                        if($('#name').parent().children('.help-block').html()){
                            $('#name').parent().children('.help-block').remove();
                        }
                        $('#saveParty').attr('disabled',false);
                    }
                }
            }, function (data) {
                console.log(data);
            });
        }
    }else{
        if(!$('#name').parent().children('.help-block').html()){
            $('#name').after('<p class="help-block" style="color:red">活动名称不能为空</p>');
        }
    }
};

var saveParty = function(){
    var partyType = $('#partyType').val();
    if( partyType == 0){
       var aList = $('#selectAddress').children('a');
       var addressIds = '';
       if( aList && aList.length > 0){
           for(var i=0;i<aList.length;i++){
               addressIds += $(aList[i]).attr('addressId');
               if( i < aList.length-1){
                   addressIds += ',';
               }
           }
       }

        if( aList.length == 0){
            alert("请选择场地");
            return;
        }

        var obj = {
            'name': $('#name').val(),
            'type':partyType,
            'danmuLibraryId':$('#danmuLibraryId').val(),
            'addressIds':addressIds,
            'id':_update_partyId
        }
        findPartyByName();
    }else{
        var dmDensity = $('#dmDensity').val();
        if( !dmDensity ){
            alert('请填写弹幕密度');
            return;
        }
        var reg = /^[0-9]*$/g;
        if(!reg.test(dmDensity)){
            alert('弹幕密度只能为数字');
            return;
        }
        var obj = {
            'name': $('#name').val(),
            'type':partyType,
            'movieAlias': $('#movieAlias').val(),
            'dmDensity':$('#dmDensity').val(),
            'danmuLibraryId':$('#danmuLibraryId').val(),
            'id':_update_partyId
        }

        findPartyByName();
        //findPartyByShortName();
    }

    if(obj.danmuLibraryId == 0){
        alert('请选择弹幕库');
        return;
    }



    if(!$('.help-block').html()){
        $.danmuAjax('/v1/api/admin/party/save', 'POST','json',obj, function (data) {
            if( data.result == 200){
                window.location.href='/party/resource?partyId='+data.data.id+"&type="+partyType;
            }else{
                if(data.result_msg){
                    alert(data.result_msg)
                }else{
                    alert('保存失败')
                }
            }
        }, function (data) {
            console.log(data);
        });
    }else{
        $('#saveParty').attr('disabled',true);
    }
}

var returnPartyList = function(){
    window.location.href='/party/';
}


initMovieAlias();
findPartyById();