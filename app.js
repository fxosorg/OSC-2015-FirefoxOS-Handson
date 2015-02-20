//var server = 'http://fxos-ps.azurewebsites.net';
var server = 'http://localhost:8000';
var api = server + '/api/photos';
var apiget = server + '/api/myphotos/';

var constrainedWidth = 240;
var constrainedHeight = 320;

var $$ = function(selector) {return document.querySelector(selector); }
var $$$ = function(tag) { return document.createElement(tag); };

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
    console.log('query', apiget + username)
    $.ajax({
      url: apiget + username,
      success: callback,
      dataType: 'json'
    });
  }
};

var cnvCtrl = {
  /** CONTRACTOR **/
  init: function(){
    cnvCtrl.canvas = $$('#camera');
    cnvCtrl.ctx    = cnvCtrl.canvas.getContext('2d');
    cnvCtrl.video.element = $$('#camera_video');
    cnvCtrl.resize();
    screen.onmozorientationchange = cnvCtrl.resize;
  },
  /** CANVAS **/
  drowImg: function(img) {
    cnvCtrl.ctx.drawImage(img, 0, 0, cnvCtrl.canvas.width, cnvCtrl.canvas.height);
  },
  createImage: function(base64) {
    var img = $$$('img');
    img.setAttribute('src', base64);
    return img;
  },
  resize: function(e){
    // 320 x 240
    cnvCtrl.canvas.width  = constrainedWidth;
    cnvCtrl.canvas.height = constrainedHeight;
    cnvCtrl.video.element.width  = constrainedWidth;
    cnvCtrl.video.element.height = constrainedHeight;
  },
  isPortrait: function(){ // 縦方向だとtrue
    console.log( screen.orientation)
    return screen.mozOrientation === 'portrait';
  },
  /** SHOW CONTROLLER **/
  show:{
    video:function(){
      $$('#camera_video').className = 'show';
      $$('#camera').className = 'hide';
    },
    canvas:function(){
      $$('#camera_video').className = 'hide';
      $$('#camera').className = 'show';
    }
  },
  /** VIDEO **/
  video:{
    element:null,
    MediaStream:null,
    sucess: function(localMediaStream){
      cnvCtrl.video.MediaStream = localMediaStream;
      // ううん・・・firefox os で onloadedmetadata が動かない？
//       cnvCtrl.video.element.onloadedmetadata = function(e) {
//         cnvCtrl.video.element.play();
//       };
      cnvCtrl.video.element.src = window.URL.createObjectURL(localMediaStream);
      cnvCtrl.video.element.play();
      cnvCtrl.video.element.addEventListener("click", function shot() {
        console.log('on click');
        try{
          cnvCtrl.drowImg(cnvCtrl.video.element);
          cnvCtrl.video.element.pause()
        }catch(e){ console.log('done drow', e); }
        
        cnvCtrl.video.MediaStream.stop();
        cnvCtrl.show.canvas();
        cnvCtrl.video.element.removeEventListener("click", shot);
      });
    },
    error: function(err) {
      console.log("The following error occured: " + err);
    }
  }
};
cnvCtrl.init();

var onload_func = function() {

  var imageSave = function(){
    // ユーザー名とタイトルは必須！
    console.log('push test');
    photoService.save(
      {
        img:   cnvCtrl.canvas.toDataURL(),
        title: $$('#title').value,
        usr:   $$('#username').value
      }, function(data) {
        console.log('sucess!', data);
      });
  };
  $$('#imageSave').addEventListener('click', imageSave, false);

  /************************** use camera **************************/
  navigator.getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia);

  var video_constraints = {
    "mandatory": {
      "minWidth": constrainedWidth,
      "minHeight": constrainedHeight,
      "minFrameRate": "30"
    }
  };

  var shutter = function() {
      cnvCtrl.show.video();
      navigator.getUserMedia({
          video: video_constraints,
          audio: false
        },
        cnvCtrl.video.sucess,
        cnvCtrl.video.error
      );
  };
  $$('#shutter').addEventListener('click', shutter, false);

};
document.addEventListener('DOMContentLoaded', onload_func, false);