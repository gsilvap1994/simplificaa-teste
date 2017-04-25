var map;
var geocoder;
var infowindow;
var filterOption;

// initialize the map
function initMap(){
  var options = {
    zoom: 7,
    center: { lat: -23.5430, lng: -46.5668  },
  }

  map = new google.maps.Map(document.getElementById('map'), options);

  geocoder = new google.maps.Geocoder();

}

$(document).ready(function(){
  initMap();

  $('#search').click(function(){
    var address = $('#address').val();
    var filterOption = $('select').val();
    console.log(filterOption);
    if (filterOption === null) {
      $('.error-msg').val('Escolha um filtro acima');
    }
    else if(validate(address) == false) alert('Caracteres inválidos no endereço digitado!');
    else if(address != "" && validate(address)) showInMap(address);
  });


});

// validate for invalid chars
function validate(address) {
  if(/(@|!|#|\$|%|&|\*|\(|\)|\+|_|=|{|}|\[|\]|\|)/i.test(address)) {
    return false;
  }
  else{
    return true;
  }
}


// show the address
function showInMap(address) {
  geocoder.geocode({ 'address': address + ', Brasil', 'region': 'BR' }, function(results, status){
    if(status == google.maps.GeocoderStatus.OK) {
      if(results[0]) {
        makeSearch(results);
      }
    }
    else {
      alert('Sua busca não retornou um resultado válido. Verifique seu endereço/cep e tente novamente.')
    }
  });
}

function makeSearch(results) {
  if(results[0]) {
    var lat = results[0].geometry.location.lat();
    var lng = results[0].geometry.location.lng();

    $('#address').val(results[0].formatted_address);

    var location = new google.maps.LatLng(lat, lng);

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    var request = {
      location: location,
      radius: 5000,
      type: 'car_repair',
      keyword: 'oficina',
      name: 'mecanica'
    }
    service.nearbySearch(request, callback);
    var marker = new google.maps.Marker({
      map: map,
      position: location
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    map.setCenter(location);
    map.setZoom(12);
    infowindow.setContent('Você está aqui!');
    infowindow.open(map, marker);

  }
}

function callback(results, status) {
  var service = new google.maps.places.PlacesService(map);
  if (status === google.maps.places.PlacesServiceStatus.OK){
    for(var i = 0; i < results.length; i++) {
      place = results[i];
       service.getDetails({ placeId : place.place_id}, function (_place, status){
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log("quero ver a option aqui: "+filterOption);
            if (filterOption == 1) {
              createMarker(_place);
              generateTable(_place);
            }
            if(filterOption == 2) {
              if(_place.rating != undefined && _place.rating >= 4){
                console.log(_place.name+' Avaliação: '+_place.rating);
                createMarker(_place);
              }
            }

          }
       });
    }
  }
}


function createMarker(place) {

  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });


  google.maps.event.addListener(marker, 'click', function(){
    infowindow.setContent('<strong>'+place.name+'</strong><br> Endereço: '+place.formatted_address+
    '<br> Telefone: '+isUndefined(place.formatted_phone_number)+'<br> Avaliação: '+isUndefined(place.rating)+
    '<br> Site: '+isUndefined(place.website));
    infowindow.open(map, this);
  });
}



// criar tabela para mostrar todas as informações desejadas para poder mudar o método de organização


function generateTable(place) {
  $('.places-list').append('<li>'+place.name+' Endereço: '+place.formatted_address+'</li>');
}

function isUndefined(input) {
  if (input === undefined) {
    return "não informado";
  }
  else return input;
}
