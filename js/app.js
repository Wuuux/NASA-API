

$(function() {

    var nasaUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=';
    var randomSol = Math.floor((Math.random() * 1000) + 1);
    var apiKey = '1l6yGRjzJeBCKkDLfVQx1x9caU3a75NSAwsmnkic';

    var photoUrl;
    var photosFromMars;
    var indexOfPhotosFromMars = 1; // 0 photo is for cover

    // max keep count of images waiting to load
    var max = 0;

    // show image after loading - the last loaded image trigers showing row of images
    function showImg(){
      $(this).show();
      max--;
      // max = 0 it means the last image is loaded
      // time to show the row of images
      if (max == 0) {
        $('div.galleryRow').show();
        $('#moreH2').text("MORE ("+(photosFromMars.length-indexOfPhotosFromMars) +")").css('color','#EEE').show();;

      }
    }
    // event load for images
    $('div.galleryRow img').on('load',showImg);

    // function loadBuffor: preloading images to buffor
    var bufforCount = 0;
    function loadBuffor(){
      var $buffor = $(
        "<div class='row galleryRow displayed'>"+
        "<div class=' col-sm-6 col-md-4 col-lg-2 imgMars'><img class='img-responsive gallery img-rounded' ></div>"+
        "<div class=' col-sm-6 col-md-4 col-lg-2 imgMars'><img class='img-responsive gallery img-rounded' ></div>"+
        "<div class=' col-sm-6 col-md-4 col-lg-2 imgMars'><img class='img-responsive gallery img-rounded' ></div>"+
        "<div class=' col-sm-6 col-md-4 col-lg-2 imgMars'><img class='img-responsive gallery img-rounded' ></div>"+
        "<div class=' col-sm-6 col-md-4 col-lg-2 imgMars'><img class='img-responsive gallery img-rounded' ></div>"+
        "<div class=' col-sm-6 col-md-4 col-lg-2 imgMars'><img class='img-responsive gallery img-rounded' ></div>"+
        "</div>");
        $buffor.css('display','none');
        bufforCount = 0;
      // if some photos left...
      if (photosFromMars.length-indexOfPhotosFromMars > 0) {
        for (var i=0;i<6;i++){
          if (i < photosFromMars.length-indexOfPhotosFromMars) {
            // load only to the last image
            $buffor.find('img').eq(i).attr("src", photosFromMars[i+indexOfPhotosFromMars]['img_src']);
            bufforCount++;
          }
        }
      }
      $buffor.appendTo("div.mainGallery");
    };

    $.ajax({
            url: nasaUrl+randomSol+"&api_key="+apiKey,
            type: "GET",
            dataType: "json",
            headers: {  }
        }). done(function(response){

          $(response).each(function(index, item){

                  photosFromMars = item.photos;
                  photoUrl = photosFromMars[0]['img_src'];
                  max = 0;
                  $('#nasaH1').html('NASA API Challenge<br>solar day : ' + randomSol);
                  //first image - cover for page
                  $("img#mainMars").attr("src", photoUrl);

                  // if six or less photos left take the rest of them
                  if ( photosFromMars.length <= 7 ){
                    for(var i=1;i<=photosFromMars.length;i++){
                      $("div.galleryRow").find('img').eq(i-1).attr("src", photosFromMars[i]['img_src']);
                      $('div.moreButton').hide();
                      max++;
                    }
                  } else {
                    // if there are more photos
                    // take all 6 images
                    for(var i=1;i<=6;i++){
                      $("div.galleryRow").find('img').eq(i-1).attr("src", photosFromMars[i]['img_src']);
                      max++;
                    }
                    indexOfPhotosFromMars += 6;
                    $('#moreH2').text('LOADING...').css('color','red');
                  }
                  loadBuffor();
          });
        }).fail(function(error){
          $('#nasaH1').text('NASA API Challenge : ERROR').css('color','red');
        });

        // button MORE click
        $('div.moreButton').on('click', function(){
          // show buffor
          $('img.gallery').show();
          $('div.galleryRow').css('display','block');
          // increase count of images
          indexOfPhotosFromMars += bufforCount;

          $('#moreH2').text("MORE ("+(photosFromMars.length-indexOfPhotosFromMars) +")");
          if (photosFromMars.length > indexOfPhotosFromMars) loadBuffor()
          else $('div.moreButton').hide();
        });


});
