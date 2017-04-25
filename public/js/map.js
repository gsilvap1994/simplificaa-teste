var map;
var geocoder;
var infowindow;
var filterOption;
var markers = [];
var rating;
var address;

// função básica para inicializar o mapa
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

  // ao clicar no botão 'pronto' ou apertar enter no teclado, a função mainProcedure é chamada
  $('#search').click(function(){
    mainProcedure();
  });
  $('#address').keypress(function(e) {
    if (e.wich == 13) mainProcedure();
  })



});

/* Na função mainProcedure, primeiro  a lista de lugares é limpada (pois será gerada uma nova lista), em seguida
  a função deleteMarkers é chamada, para limpar os markers da tela. Caso haja mensagem de erro, ela é limpada
  na terceira linha. O endereço/cep é atribuído a uma variável e a opção selecionada nos filtros (distância ou
  avaliação) é guardada na variável filterOption. Em seguida, se a opção selecionada for uma opção de distância,
  a função switchRadius é chamada, pois a distância selecionada pelo usuário será usada no request da função
  nearbySearch. Se for uma opção de avaliação, então a função switchRating é chamada, para determinar a avaliação
  mínima selecionada dentre as opções, e a distância padrão para esse tipo de consulta (opção = avaliação) é 4 km
  (radius = 4000). Por fim, o endereço digitado pelo usuário é validado para caracteres inválidos, e se passar na
  validação, então a função showInMap é chamada.
*/
function mainProcedure() {
  $('.places-list').empty();
  deleteMarkers();
  $('.error-msg').text('');
  address = $('#address').val();
  filterOption = $('#distanceOrRating').val();
  var radius;
  if(filterOption > 0 && filterOption < 5) {
    radius = switchRadius(filterOption);
  }
  else {
    rating = switchRating(filterOption);
    radius = 4000;
  }
  if(validate(address) == false) $('.error-msg').text('Caracteres inválidos no endereço digitado!');
  else if(address != "" && validate(address)) showInMap(address, radius);
}

//  Switch para atribuir o valor selecionado pelo usuário para o raio da nearbySearch
function switchRadius(filterOption) {
    switch(filterOption) {
      case '1':
        return 1000;
      case '2':
        return 3000;
      case '3':
        return 5000;
      case '4':
        return 10000;
    }
}

// Swtch para atribuir o valor selecionado pelo usuário para o rating mínimo na consulta do detailSearch
function switchRating(filterOption) {
  switch(filterOption) {
    case '5':
      return 5;
    case '6':
      return 4;
    case '7':
      return 3;
  }
}

// Valida o endereço digitado pelo usuário para caracteres inválidos
function validate(address) {
  if(/(@|!|#|\$|%|&|\*|\(|\)|\+|_|=|{|}|\[|\]|\|)/i.test(address)) {
    return false;
  }
  else{
    return true;
  }
}


/* Mostra o endereço no mapa. Faz uma solicitação para o geocode api, para obter a latitude e longitude a partir do
  Cep ou endereço digitado pelo usuário. Caso a busca não encontre nada. o GeocoderStatus será diferente de OK
  e então uma mensagem de erro será apresentada.
*/
function showInMap(address, radius) {
  geocoder.geocode({ 'address': address + ', Brasil', 'region': 'BR' }, function(results, status){
    if(status == google.maps.GeocoderStatus.OK) {
      if(results[0]) {
        makeSearch(results[0], radius);
      }
    }
    else {
      $('.error-msg').text('Sua busca não retornou um resultado válido. Tente novamente.')
    }
  });
}


/* Essa função é a responsável por fazer a busca das oficinas na proximidade da localização digitada.
   Primeiro, a latitude e longitude do local retornado pela busca do geocoder são armazenadas nas variáveis lat
   e lng. Uma localização é criada a partir dessas variáveis. Em seguida a janela de informação é criada, e a
   variável service é inicializada para poder fazer a requisição para a api do google places. A consulta do
   nearbySearch é feita com os parâmetros localização (obitida pelo geocoder), raio (selecionado entre
   as opções disponíveis ou 5000 - valor definido como padrão para buscas por avaliação), tipo (car_rapair),
   palavra chave (oficina), e nome (mecanica, para filtrar melhor os resultados). A chamada para o nearbySearch
   é feita passando o objeto request criado. Em seguida é adicionado um marker para o local que o usuário
   digitou que terá a janela de informação escrita 'você está aqui'.
*/
function makeSearch(result, radius) {
    var lat = result.geometry.location.lat();
    var lng = result.geometry.location.lng();

    $('#address').val(result.formatted_address);
    var location = new google.maps.LatLng(lat, lng);

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    var request = {
      location: location,
      radius: radius,
      type: 'car_repair',
      keyword: 'oficina',
      name: 'mecanica',
      rankby: google.maps.places.RankBy.DISTANCE
    }
    service.nearbySearch(request, callback);
    addMarker(location);
    markers[0].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    map.setCenter(location);
    map.setZoom(switchSetZoom(filterOption));
    infowindow.setContent('Você está aqui!');
    infowindow.open(map, markers[0]);
    google.maps.event.addListener(markers[0], 'click', function(){
      infowindow.setContent('Você está aqui!');
      infowindow.open(map, markers[0]);
    });
}

// Switch para deixar o zoom do mapa adequado ao raio de quilometragem selecionado
function switchSetZoom(filterOption) {
  switch(filterOption) {
    case '1':
      return 14;
    case '2':
      return 13;
    case '3':
      return 12;
    case '4':
      return 10;
    default:
     return 12;
  }
}

/* A função callback é o callback da requisição feita para o nearbySearch. Dentro desse callback é feito
  uma iteração entre os resultados obtidos pelo nearbySearch. A iteração só vai até 8 pois é o máximo de
  resultados para utilizar o getDetails sem obter OVER_QUERY_LIMIT. Para cada lugar obtido no nearbySearch
  é feito uma busca mais detalhada (getDetails) utilizando o place_id. Em seguida são duas opções de criar
  os markers: uma é se foi selecionado o filtro por Distância (filterOption > 0 && filterOption < 5), para
  essa opção, serão criado todos os markers dos resultados obtidos; e a outra é se foi selecionado o filtro
  por Avaliação, que serão mostrados no mapa apenas os lugares onde a avaliação está definida e é maior que
  a avaliação mínima escolhida pelo usuário. Dentro de cada uma serão gerados os lugares no mapa
  (createMarkerWithInformation) e será criada uma lista adicional (generateList).
*/
function callback(results, status) {
  var service = new google.maps.places.PlacesService(map);
  if (status === google.maps.places.PlacesServiceStatus.OK){
    for(var i = 0; i < 8; i++) {
      place = results[i];
      service.getDetails({ placeId : place.place_id}, function (_place, status){
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (filterOption > 0 && filterOption < 5) {
              createMarkerWithInformation(_place);
              generateList(_place);
            }
            else {
              if(_place.rating != undefined && _place.rating >= rating){
                createMarkerWithInformation(_place);
                generateList(_place);
              }
            }
          }
       });
    }
  }
}

/* Cria os lugares no mapa e adiciona a janela com as seguintes informações: nome, endereço, telefone,
  avaliação, e site. Cada um é testado pela função isUndefined.
*/
function createMarkerWithInformation(place) {

  var placeLoc = place.geometry.location;
  addMarker(placeLoc);
  google.maps.event.addListener(markers[markers.length-1], 'click', function(){
    infowindow.setContent(createInfoContent(place));
    infowindow.open(map, this);
  });
}

// Cria a informação presente dentro da janela de informação
function createInfoContent(place) {
  return '<strong>'+place.name+'</strong><br> Endereço: '+place.formatted_address+
  '<br> Telefone: '+isUndefined(place.formatted_phone_number)+'<br> Avaliação: '+isUndefined(place.rating)+
  '<br> Site: '+isUndefined(place.website)
}
// Gera a lista de lugares retornados pela busca para ser manipulada posteriormente
function generateList(place) {
  $('.places-list').append('<li class="text-list">'+place.name+' Endereço: '+place.vicinity+' Avaliação: '+
  isUndefined(place.rating)+'<a href="#" class="'+place.place_id+' see-in-map '+place.rating+'"> Ver no mapa</a></li> ');
}

// Ao clicar no ver no mapa na lista, o mapa foca no endereço selecionado
$('ol').on('click', 'a.see-in-map', function(){
  var place_id = $(this).context.classList[0];
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({ placeId: place_id}, function (place, status) {
    if(status === google.maps.places.PlacesServiceStatus.OK) {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  })
});


/* Determina se a variável é indefinida, se for, retorna não informado (para não criar janelas de informações
   com valores indefinidos).
*/
function isUndefined(input) {
  if (input === undefined) {
    return "não informado";
  }
  else return input;
}


// Cria um marker no mapa e coloca ele no array markers[].
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

// Seta o mapa para todos os markers no array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Remove os markers do mapa, mas mantém eles no array.
function clearMarkers() {
  setMapOnAll(null);
}

// Deleta os markers do mapa, deletando também do array.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
