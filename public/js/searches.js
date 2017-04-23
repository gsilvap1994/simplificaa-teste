$('#search').click(function(){
  var lat, lng;
  var cep = $('#CEP').val();
  $.ajax({
    url:"https://maps.googleapis.com/maps/api/place/textsearch/json?query="+
    cep+"&key=AIzaSyDSaakUM5B7x4As2NLmexGfRHg8heAjwLc",
    method: "GET",
    error: function(error) {
      console.log(error);
    }
  }).done(function(response){
    lat = response.results[0].geometry.location.lat;
    lng = response.results[0].geometry.location.lng;
  }).then(function(){

  });

});
