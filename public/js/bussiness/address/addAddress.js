var addressId = '';

var initSelect = function(){
    $('#selectedP').append('<option value="0">请选择</option>');
    for(var i=0;i<_provinces.length;i++){
        $('#selectedP').append('<option value="'+_provinces[i].ProID+'">'+_provinces[i].name+'</option>');
    }
    $('#selectedC').append('<option value="0">请选择</option>');
    $('#selectedA').append('<option value="0">请选择</option>');
}

var selecteProvince = function () {
    var selectedP = $('#selectedP').val();
    $('#selectedC').empty();
    $('#selectedC').append('<option value="0">请选择</option>');
    $('#selectedA').empty();
    $('#selectedA').append('<option value="0">请选择</option>');
    for (var i = 0; i < _cities.length; i++) {
        if (_cities[i].ProID == selectedP) {
            $('#selectedC').append('<option value="'+_cities[i].CityID+'">'+_cities[i].name+'</option>');
        }
    }
}

var selecteCity = function () {
    var selectedC = $('#selectedC').val();
    $('#selectedA').empty();
    $('#selectedA').append('<option value="0">请选择</option>');
    for (var i = 0; i < _areas.length; i++) {
        if (_areas[i].CityID == selectedC) {
             $('#selectedA').append('<option value="'+_areas[i].Id+'">'+_areas[i].DisName+'</option>');
        }
    }
}


var openUpdateAddress = function (addressId) {
        var object ={
            id:addressId
        }
        $.danmuAjax('/v1/api/admin/address/query', 'GET','json',object, function (data) {
                $('#selectedP').val(data.data.provinceId)
                $('#selectedC').append('<option value="0">请选择</option>');
                for (var i = 0; i < _cities.length; i++) {
                    if (_cities[i].CityID == data.data.cityId) {
                        $('#selectedC').append('<option value="'+_cities[i].CityID+'">'+_cities[i].name+'</option>');
                    }
                }
                $('#selectedA').append('<option value="0">请选择</option>');
                for (var i = 0; i < _areas.length; i++) {
                    if (_areas[i].CityID == data.data.cityId) {
                         $('#selectedA').append('<option value="'+_areas[i].Id+'">'+_areas[i].DisName+'</option>');
                    }
                }
                var t;
                if (t) {
                    clearTimeout(t);
                }
                t = setTimeout(function () {
                    $('#selectedC').val(data.data.cityId);
                    $('#selectedA').val(data.data.areaId)

                }, 100);

                var location = data.data.location;
                if (location != null && location.coordinates != null && location.coordinates.length > 0) {
                    $('#longitude').val(location.coordinates[0]);
                    $('#latitude').val(location.coordinates[1]);
                }
                $('#addressName').val(data.data.name);
                $('#addressStr').val(data.data.address);
                $('#length').val(data.data.length);
                $('#width').val(data.data.width);
                $('#height').val(data.data.height);
                $('#contacts').val(data.data.contacts);
                $('#phoneNum').val(data.data.phoneNum);
                $('#peopleNum').val(data.data.peopleNum);
                $('#addressId').val(data.data.id);
                $('#range').val(data.data.range);
                $('#addressType').val(data.data.type);
                $('shape').val(data.data.shape);
            }, function (data) {
                     console.log(data);
                 });

}

var getAddressByUrl = function(){
    var url = window.location.href;
    if(url.indexOf('addressId=')!=-1){
        addressId = url.substr(url.indexOf('addressId=')+10,url.length);
        openUpdateAddress(addressId);
    }
}

var returnAddressList = function(){
    window.location.href='/cinema';
}

var saveAddress = function(){
    var postUrl = '';
    if ('' == addressId) {
        postUrl = '/v1/api/admin/address/save';
    } else {
        postUrl = '/v1/api/admin/address/update';
    }

    if ($('#selectedP').val() == 0) {
        alert('请填写省份!');
        return;
    }
    if ($('#selectedC').val() == 0) {
        alert('请填写城市!');
        return;
    }

    if ($('#selectedA').val() == 0) {
        alert('请填写地区!');
        return;
    }

    if($('#range').val()==0){
        alert('请填写范围!');
        return;
    }



    var object = {
        'id': addressId,
        'name': $('#addressName').val(),
        'address': $('#addressStr').val(),
        'cityId': $('#selectedC').val(),
        'provinceId': $('#selectedP').val(),
        'areaId': $('#selectedA').val(),
        'longitude': $('#longitude').val(),
        'latitude': $('#latitude').val(),
        'length': $('#length').val(),
        'width': $('#width').val(),
        'height': $('#height').val(),
        'contacts': $('#contacts').val(),
        'phoneNum': $('#phoneNum').val(),
        'peopleNum': $('#peopleNum').val(),
        'range': $('#range').val(),
        'type':$('#addressType').val(),
        'shape':$('#shape').val()
    };

    $.danmuAjax(postUrl, 'POST','json',object, function (data) {
        if (data.result == 200) {
          console.log(data);
            window.location.href='/cinema';
          }else{
             alert('方圆一公里内只允许创建一个场地!')
          }
    }, function (data) {
        console.log(data);
    });
}


initSelect();
getAddressByUrl();