//var server = 'http://fxos-ps.azurewebsites.net';
var server = 'http://localhost:8000';
var api = server + '/api/photos';
var apiget = server + '/api/myphotos/';

var $$ = function(selector) {
  return document.querySelector(selector);
}
var photoService = {
  save: function(photo_data, callback) {
    $.ajax({
      type: 'POST',
      data: JSON.stringify(photo_data),
      contentType: 'application/json',
      url: api,
      success: callback
    });
  },
  query: function(username, callback) {
    console.log(username)
    $.ajax({
      url: apiget + username,
      success: callback,
      dataType: 'json'
    });
  }
};

var cnvCtrl = {
  drowImg: function(video) {
    cnvCtrl.ctx.drawImage(video, 0, 0, cnvCtrl.canvas.width, cnvCtrl.canvas.height);
  },
  createImage: function(base64) {
    var img = document.createElement('img');
    img.setAttribute('src', base64);
    return img;

  }
};
cnvCtrl.canvas = (function() {
  return document.getElementById('camera')
})();
cnvCtrl.ctx = (function() {
  return cnvCtrl.canvas.getContext('2d')
})();
cnvCtrl.canvas.width = 320;
cnvCtrl.canvas.height = 240;


$(function() {

  $('#imageSave').click(function() {
    photoService.save(
      {
        img: cnvCtrl.canvas.toDataURL(),
        usr: $('#username').val()
      }, function(d) {
      console.log('sucess!', d)
    });
  });

  $('#imageLoad').click(function() {
    photoService.query($('#username').val(), function(data) {
      console.log('sucess!:v:', data);
      data.photo_data.forEach(function(v) {
        var li = $('<dd>');
        li.append(cnvCtrl.createImage(v.img))
        $('#imglist')
          .append($('dt').append('画像'))
          .append(li)
      });
    });
  });

  /************************** use camera **************************/
  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


  $('#shutter').click(function() {
    if (navigator.getUserMedia) {
      navigator.getUserMedia({
          video: true,
          audio: false
        },
        function(localMediaStream) {
          var video = document.querySelector('video');
          video.src = window.URL.createObjectURL(localMediaStream);
          video.width = cnvCtrl.canvas.width;
          video.height = cnvCtrl.canvas.height;
          video.onloadedmetadata = function(e) {
            console.log(e, video)
            video.play();
          };

          cnvCtrl.canvas.addEventListener("click", function shot() {
            cnvCtrl.drowImg(video);
            localMediaStream.stop();
            cnvCtrl.canvas.removeEventListener("click", shot);
          });
        },
        function(err) {
          console.log("The following error occured: " + err);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  });

});