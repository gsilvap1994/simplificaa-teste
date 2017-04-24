var key = 'AIzaSyDSaakUM5B7x4As2NLmexGfRHg8heAjwLc';

$('#search').click(function(){
  var lat, lng;
  var cep = $('#CEP').val();

  // get the latitude and the longitude from de zip code
  $.ajax({
    url:"https://maps.googleapis.com/maps/api/place/textsearch/json?query="+
    cep+"&key="+key,
    method: "GET",
    error: function(error) {
      console.log(error);
    }
  }).done(function(response){
    lat = response.results[0].geometry.location.lat;
    lng = response.results[0].geometry.location.lng;
  }).then(function(){

    // get the nearby places by the given location, default - radius = 5000m 
    $.ajax({
      url:"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+
      "&radius=5000&type=car_repair&keyword=oficina&key="+key,
      method: "GET",
      error: function(error) {
        console.log(error);
      }
    }).done(function(response){
      console.log(response);
      $('.places-list').append('<li>Aee porra</li>')
    })
  });

});
