// NASA API Challenge
//
// Zadanie polega na wykorzystaniu API udostępnionego przez NASA.
//
// Zapoznaj się się z API wystawionym przez NASA. Zobacz jak wyglada dokumentacja, jakie dane możesz otrzymać oraz jak budować zapytania.
//
// Przed przystąpieniem do pisania kodu, upewnij się, że masz własny API Key (wypełnij formularz na stronie).
//
// Zadanie polega na stworzeniu strony, która składa się z dwóch sekcji.
//
// Każda z sekcji powinna mieć 100% szerokości i wysokości okna przeglądarki.
//
// Pierwsza sekcja to sekcja powitalna. Na samym środku sekcji powinien znajdować się napis NASA API Challenge.
// Tłem całej sekcji powinien być jakikolwiek obrazek (na przykład zdjęcie Ziemi bądź innej planety) pobrany poprzez API.
//
// Druga sekcja posiada galerię, który wyświetla zdjęcia Marsa. Wykorzystaj API do tego potrzebne.
// Galeria na starcie powinna pokazywać 6 zdjęć. Pod galerią umieść przycisk Load more. Po naciśnięciu powinno się pojawić 6 zdjęć więcej.
//
// Zadania dodatkowe
//
// Zmodyfikuj zapytanie o obrazek do pierwszej sekcji tak, aby za każdym razem był pobierany inny obrazek.
//
// Wykorzystaj technikę preloadingu przy wyświetlaniu nowych elementów w galerii.
//
// Pamiętaj o responsywności. Wybór czcionek, wygląd przycisków, wygląd galerii zależy od Ciebie - puść wodze fantazji!




$(function() {



    function putIntoBuffor(){
      if (photosFromMars.length <= indexOfPhotosFromMars) return false;

      if ((photosFromMars.length - indexOfPhotosFromMars) <= 6){
        for(var i=0;i<6;i++){
          if (i < (photosFromMars.length - indexOfPhotosFromMars)) $("div.buffor").find("img.gallery").eq(i).attr("src",photosFromMars[i+indexOfPhotosFromMars]['img_src'])
          else $("div.buffor").find("img.gallery").eq(i).hide();
        };

      } else {

        for(var i=1;i<7;i++){
          $galleryCopy.find("img.gallery").eq(i-1).attr("src",photosFromMars[i]['img_src']);
          indexOfPhotosFromMars++;
        };

      };

    };
    var max = 0;
    function showImg(){
      $(this).show();
      max--;
      if (max == 0) {
          $('div.displayed').show();
          $('#moreH2').text("MORE ("+(photosFromMars.length-indexOfPhotosFromMars) +" images left)");
          $('#moreH2').css('color','#eeeeee')
      }
    }


    var $opening      = $("#opening");

    var nasaUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=';
    var randomSol = Math.floor((Math.random() * 1000) + 1);
    $('#nasaH1').html('NASA API Challenge <br>(solar day : '+randomSol+')');
    var apiKey = '1l6yGRjzJeBCKkDLfVQx1x9caU3a75NSAwsmnkic';

    var photoUrl;
    var photosFromMars;
    var indexOfPhotosFromMars = 1; // 0 photo is for cover
    var $galleryCopy;
    var $gallery = $('div.galleryRow.displayed');
    // var $gallery = $('div.galleryRow.displayed').clone();

    $.ajax({
            url: nasaUrl+randomSol+"&api_key="+apiKey,
            type: "GET",
            dataType: "json",
            headers: {  }
          }
        ). done(function(response){

          $(response).each(function(index, item){

                  // putIntoBuffor();

                  $galleryCopy = $('div.galleryRow.displayed');
                  $galleryCopy.find('img.gallery').hide();
                  console.log('ukryte?:',$galleryCopy.find('img'));
                  photosFromMars = item.photos;
                  console.log('photos count:',photosFromMars.length);

                  photoUrl = photosFromMars[0]['img_src'];
                  $("#opening").css("background-image", "url('"+photoUrl+"')");

                  if (photosFromMars.length <= 7){
                    for(var i=1;i<=6;i++){
                      if (i < photosFromMars.length) {
                        $("img.gallery").eq(i-1).attr("src",photosFromMars[i]['img_src']);
                        max++;
                      };
                      $galleryCopy.find("img.gallery").eq(i-1).css('display','none');
                      $galleryCopy.find("img.gallery").eq(i-1).on( "load", showImg);

                      indexOfPhotosFromMars++;
                    };
                    $('div.moreButton').hide();
                  } else {

                    for(var i=1;i<7;i++){
                      $galleryCopy.find("img.gallery").eq(i-1).attr("src",photosFromMars[i]['img_src']);
                      $galleryCopy.find("img.gallery").eq(i-1).css('display','none');
                      $galleryCopy.find("img.gallery").eq(i-1).on( "load", showImg);
                      max++;
                      indexOfPhotosFromMars++;
                    };

                  };
                  // $galleryCopy.find('img').on( "load", function(){
                  //   $(this).show();
                  // });
                  $galleryCopy.css('display','none');
                  $galleryCopy.on( "load", function(){ console.log('ready')  });
                  $('#moreH2').text("WAIT!");
                  $('#moreH2').css('color','red');
                  $galleryCopy.insertBefore('div.moreButton');
          });

        }).fail(function(error){
          $('#nasaH1').html('NASA API Challenge <br> error');
          $('#nasaH1').css('color','red')
        });

        var $galleryCopy = $('div.galleryRow.displayed');

        $('div.moreButton').on('click', function(){
          max = 0;

          var $galleryCopy = $('div.galleryRow.displayed').first().clone();

          if ( (photosFromMars.length - indexOfPhotosFromMars) <= 6){

            for(var i=0;i<6;i++){
                  if (i+indexOfPhotosFromMars < photosFromMars.length) {
                    $galleryCopy.find("img.gallery").eq(i).attr("src",photosFromMars[i+indexOfPhotosFromMars]['img_src']);
                    $galleryCopy.find("img.gallery").eq(i).css('display','none');
                    $galleryCopy.find("img.gallery").eq(i).on( "load", showImg);
                    max++;
                  } else {
                    $galleryCopy.find("img.gallery").eq(i).css('display','none');
                    console.log('usuwam/wygaszam nr: ',i+indexOfPhotosFromMars);
                  };
            };
            $('div.moreButton').hide();
          } else {

            for(var i=0;i<6;i++){

              if (typeof photosFromMars[i+indexOfPhotosFromMars] != 'undefined')  {
                // console.log(i+indexOfPhotosFromMars);
              $galleryCopy.find("img.gallery").eq(i).attr("src",photosFromMars[i+indexOfPhotosFromMars]['img_src']);
              $galleryCopy.find("img.gallery").eq(i).css('display','none');
              $galleryCopy.find("img.gallery").eq(i).on( "load", showImg);
              max++;
              }
            }
            indexOfPhotosFromMars += 6;

          }
          $galleryCopy.css('display','none');
          $('#moreH2').text("WAIT!");
          $('#moreH2').css('color','red');
          $galleryCopy.insertBefore("div.row.moreButton");

        });


});
