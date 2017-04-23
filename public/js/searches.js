$('#search').click(function(){
  var cep = $('#CEP').val();
  $.ajax({
    url:"https://maps.googleapis.com/maps/api/place/textsearch/json?query=03316-000&key=AIzaSyDSaakUM5B7x4As2NLmexGfRHg8heAjwLc",
    success: function(data){
      console.log(data);
    },
    err: function(error) {
      console.log(error);
    }
  });
});
