window.navigator.getUserMedia =
   ( navigator.getUserMedia ||
     navigator.webkitGetUserMedia ||
     navigator.mozGetUserMedia ||
     navigator.msGetUserMedia);

var server = 'http://fxos-ps.azurewebsites.net';
var api = server + '/api/photos';

// Flame size : 320 x 240
var constrainedWidth = 240;
var constrainedHeight = 320;

var $$ = function(selector) {return document.querySelector(selector); }
var $$$ = function(tag) { return document.createElement(tag); };

var FxOSApp = {
  /** 初期化処理 **/
  init: function(){
    FxOSApp.canvas = $$('#camera');
    FxOSApp.ctx    = FxOSApp.canvas.getContext('2d');
    FxOSApp.video.element = $$('#camera_video');
    FxOSApp.resize();
  },
  /** データの保存 **/
  service:{
    save: function(){
      
      // ユーザー名とタイトルは必須！
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(data)
      {
        if( this.readyState === 4 && this.status === 200 )
        {
          console.log('sucess!', data);
        }
      }
      xhr.open( 'POST', api );
      xhr.setRequestHeader( 'Content-Type', 'application/json; charset=utf-8' );
      xhr.send(JSON.stringify({
          img:   FxOSApp.canvas.toDataURL(),
          title: $$('#title').value,
          usr:   $$('#username').value
        }));
    },
  },
  /** キャンバスとカメラ入力の操作 **/
  drowImg: function(img) {
    FxOSApp.ctx.drawImage(img, 0, 0, FxOSApp.canvas.width, FxOSApp.canvas.height);
  },
  resize: function(e){
    FxOSApp.canvas.width  = constrainedWidth;
    FxOSApp.canvas.height = constrainedHeight;
    FxOSApp.video.element.width  = constrainedWidth;
    FxOSApp.video.element.height = constrainedHeight;
  },
  /** canvasとvideoタグの切り替え **/
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
  /** ビデオ要素関係の操作 **/
  video:{
    shutter: function(){
      FxOSApp.show.video();
      window.navigator.getUserMedia({
          video:{
            "mandatory": {
              "minWidth": constrainedWidth,
              "minHeight": constrainedHeight,
              "minFrameRate": "30"
            },
          },
          audio: false
        },
        FxOSApp.video.sucess,
        FxOSApp.video.error
      );
    },
    element:null,
    MediaStream:null,
    sucess: function(localMediaStream){
      FxOSApp.video.MediaStream = localMediaStream;
      FxOSApp.video.element.src = window.URL.createObjectURL(localMediaStream);
      FxOSApp.video.element.play();
      FxOSApp.video.element.addEventListener("click", function shot() {
        window.navigator.vibrate([100,150,100,150,100]);
        FxOSApp.drowImg(FxOSApp.video.element);
        FxOSApp.video.element.pause()
        FxOSApp.video.MediaStream.stop();
        FxOSApp.show.canvas();
        FxOSApp.video.element.removeEventListener("click", shot);
      });
    },
    error: function(err) {
      console.log("The following error occured: ", err);
    }
  }
};


var onload_func = function() {

  // 初期化処理
  FxOSApp.init();

  /************************** キャンバスデータをセーブ **************************/
  $$('#imageSave').addEventListener('click', FxOSApp.service.save, false);

  /************************** カメラを使う **************************/
  $$('#shutter').addEventListener('click', FxOSApp.video.shutter, false);

};
document.addEventListener('DOMContentLoaded', onload_func, false);