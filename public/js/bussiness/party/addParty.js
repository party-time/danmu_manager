
var findPartyByName = function(){
    var name = $('#name').val();
    if('' != name){
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
    }else{
        if(!$('#name').parent().children('.help-block').html()){
            $('#name').after('<p class="help-block" style="color:red">活动名称不能为空</p>');
        }
    }
};

var findPartyByShortName = function(){
    var shortName = $('#shortName').val();
    if('' != shortName){
        var reg = /^[0-9a-zA-Z]*$/g;
        if(!reg.test(shortName)){
            if(!$('#shortName').parent().children('.help-block').html()){
                $('#shortName').after('<p class="help-block" style="color:red">活动名称简写只能为字母和数字</p>');
                $('#saveParty').attr('disabled',true);
            }
        }else{
            var obj = {
                'shortName': shortName
            }
            $.danmuAjax('/v1/api/admin/party/shortName', 'GET','json',obj, function (data) {
                if( data.result == 200){
                    if(data.data){
                        if(!$('#shortName').parent().children('.help-block').html()){
                            $('#shortName').after('<p class="help-block" style="color:red">活动名称简写重复</p>');
                        }
                        $('#saveParty').attr('disabled',true);
                    }else{
                        if($('#shortName').parent().children('.help-block').html()){
                            $('#shortName').parent().children('.help-block').remove();
                        }
                        $('#saveParty').attr('disabled',false);
                     }
                }
            }, function (data) {
                console.log(data);
            });
        }

    }else{
        if(!$('#shortName').parent().children('.help-block').html()){
            $('#shortName').after('<p class="help-block" style="color:red">活动名称简写不能为空</p>');
            $('#saveParty').attr('disabled',true);
        }
    }
};

var checkDateTime = function(str){
    var reg=/^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
    var r=str.match(reg);
    if(r==null) return false;
    r[2] = r[2]-1;
    var d= new Date(r[1],r[2],r[3],r[4],r[5]);
    if(d.getFullYear()!=r[1]) return false;
    if(d.getMonth()!=r[2]) return false;
    if(d.getDate()!=r[3]) return false;
    if(d.getHours()!=r[4]) return false;
    if(d.getMinutes()!=r[5]) return false;
    return true;
}

var dateAfter = function(date,afterDate){
    if(date>afterDate){
        return false;
    }else{
        return true;
    }
}



var checkStartTime = function(){
    var startTime = $('#startTime').val();
    var helpBlock = ''
    if( '' == startTime){
        helpBlock = '请填写开始时间';
    }else if(!checkDateTime(startTime)){
        helpBlock = '开始时间格式错误';
    }else if(!dateAfter(new Date(),new Date(startTime))){
        helpBlock = '开始时间必须要早于当前时间';
    }
    if( '' != helpBlock){
        if($('#startTime').parent().children('.help-block').html()){
            $('#startTime').parent().children('.help-block').remove();
        }
        if(!$('#startTime').parent().children('.help-block').html()){
            $('#startTime').after('<p class="help-block" style="color:red">'+helpBlock+'</p>');
            $('#saveParty').attr('disabled',true);
        }
    }else{
        if($('#startTime').parent().children('.help-block').html()){
            $('#startTime').parent().children('.help-block').remove();
        }
        $('#saveParty').attr('disabled',false);
    }
}

var initEndTime = function(){
    var startTime = new Date($('#startTime').val());
    var month = startTime.getMonth()+1;
    if(month<10){
        month = '0'+month;
    }

    var dd = startTime.getDate();
    if( dd <10){
        dd = '0'+dd;
    }
    var hour = startTime.getHours();
    hour = hour+2;
    if(hour<10){
        hour = '0'+hour;
    }
    var minute = startTime.getMinutes();
    if( minute<10){
        minute = '0'+minute;
    }
    $('#endTime').val(startTime.getFullYear()+'-'+month+'-'+dd+' '+hour+':'+minute);
}


var checkEndTime = function(){
    var endTime = $('#endTime').val();

        var helpBlock = ''
        if( '' == endTime){
            initEndTime();
        }else if(!checkDateTime(endTime)){
            helpBlock = '结束时间格式错误';
        }else if(!dateAfter(new Date($('#startTime').val()),new Date(endTime))){
            helpBlock = '结束时间必须要晚于开始时间';
        }
        if( '' != helpBlock){
            if($('#endTime').parent().children('.help-block').html()){
                $('#endTime').parent().children('.help-block').remove();
            }
            if(!$('#endTime').parent().children('.help-block').html()){
                $('#endTime').after('<p class="help-block" style="color:red">'+helpBlock+'</p>');
                $('#saveParty').attr('disabled',true);
            }
        }else{
            if($('#endTime').parent().children('.help-block').html()){
                $('#endTime').parent().children('.help-block').remove();
            }
            $('#saveParty').attr('disabled',false);
        }
}



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
            'addressIds':addressIds
        }

        findPartyByName();
        //findPartyByShortName();
        //checkStartTime();
        //checkEndTime();

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
            'danmuLibraryId':$('#danmuLibraryId').val()
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
                window.location.href='/party/resource?partyId='+data.data.id;
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

var initAddParty = function(){
    var now = new Date();
    var month = now.getMonth()+1;
    if(month<10){
        month = '0'+month;
    }

    var dd = now.getDate();
    if( dd <10){
        dd = '0'+dd;
    }
    var hour = now.getHours();
    if( hour < 24 ){
        hour = hour + 1;
    }
    if(hour<10){
        hour = '0'+hour;
    }

    var minute = now.getMinutes();
    if( minute<10){
        minute = '0'+minute;
    }
    $('#startTime').val(now.getFullYear()+'-'+month+'-'+dd+' '+hour+':'+minute);
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


var getAllDanmuLibrary = function() {
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
                    selectHtml += '<option value='+danmuLibraryList[i].id+'>'+danmuLibraryList[i].name+'</option>';
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
    $('._s'+id).remove();
    $('.btn._a'+id).remove();
    var spanList = $('#selectAddress').children('span');
    if(spanList.length ==0){
        $('#selectAddress').empty();
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
    $('#myModalLabel').html('的场地管理');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

initMovieAlias();

initAddParty();
getAllDanmuLibrary();