var arrayOfLiIni = [];

$('#list').click(function(){
  console.log($('#selectOrder').val());
  if(arrayOfLiIni.length == 0) {
    $('.text-list').each(function(){
      arrayOfLiIni.push(this);
    });
  }

  $('.error-list').text('');
  if($('.places-list').children().length == 0) {
    $('.error-list').text('Faça uma busca no topo da página para gerar uma lista');
  }
  if ($('#selectOrder').val() == null) {
    $('.error-list').text('Escolha alguma opção.')
  }
  else if($('#selectOrder').val() == 2) {
    var arrayOfLi = [];
    $('.text-list').each(function(){
      arrayOfLi.push(this);
    });

    sortRating(arrayOfLi);
    $('.places-list').empty();

     for(var i = arrayOfLi.length-1; i >= 0; i--) {
       $('.places-list').append(arrayOfLi[i]);
     }
  }
  else if($('#selectOrder').val() == 1){
    $('.places-list').empty();

    for (var i = 0; i < arrayOfLiIni.length; i++) {
      console.log(arrayOfLiIni[i])
    }
    for (var i = 0; i < arrayOfLiIni.length; i++) {
        $('.places-list').append(arrayOfLiIni[i]);
    }
  }
});


function sortRating(array) {
  var i = 0;

  while (i < array.length) {
    if( i == 0 || array[i-1].firstElementChild.classList[2] <= array[i].firstElementChild.classList[2] ) i++;
    else  {var tmp = array[i]; array[i] = array[i-1]; array[--i] = tmp; }
  }
}
