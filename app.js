window.navigator.getUserMedia = ( navigator.getUserMedia || navigator.mozGetUserMedia);

var constrainedWidth = 240;
var constrainedHeight = 320;

var $$ = function(selector) {return document.querySelector(selector); }
var $$$ = function(tag) { return document.createElement(tag); };

var FxOSApp = {
  /** 初期化処理 **/
  init: function(){
    FxOSApp.canvas = $$('#canvas');
    FxOSApp.ctx    = FxOSApp.canvas.getContext('2d');
    FxOSApp.video.element = $$('#camera_video');
    FxOSApp.camera.element = $$('#camera');
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
      xhr.open( 'POST', 'http://fxos-ps.azurewebsites.net/api/photos' );
      xhr.setRequestHeader( 'Content-Type', 'application/json; charset=utf-8' );
      xhr.send(JSON.stringify({
          img:   FxOSApp.canvas.toDataURL(),
          title: $$('#title').value,
          usr:   $$('#username').value
        }));
      var notification = new Notification('サーバへ保存しました。',{
        body: 'インターネットの世界へ送り出しました。',
        icon: window.location.origin + '/icons/firefox-16.png'
      });
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
      $$('#canvas').className = 'hide';
    },
    canvas:function(){
      $$('#camera_video').className = 'hide';
      $$('#canvas').className = 'show';
    }
  },
  /** カメラの操作 **/
  camera:{
    shutter: function(){
      var camera = $$('#camera');
      camera.onchange = function (event) {
        // 撮影された写真または選択された画像への参照を取得
        var files = event.target.files;
        if (files && files.length > 0) {
          var file = files[0];
          var img = $$$('img');
          img.onload = function(){
            FxOSApp.drowImg(img);
          };
          var dataURL = URL.createObjectURL(file);
          img.src = dataURL;
          URL.revokeObjectURL(dataURL);
        }
      }
      camera.click(); 
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
  },
  userproximity: function(event){
    FxOSApp.video.shutter();
  },
  devicelight: function(event){
    // 光は0〜500を想定
    var rgbRight = ((event.value>=500)?500:event.value) / 2;
    var palet = $$('.pickval').value || "#000000";
    var color = {
      r:parseInt(palet.substr(1,2),16),
      g:parseInt(palet.substr(3,2),16),
      b:parseInt(palet.substr(5,2),16),
      value:()=>{
        return '#'
             + ("0" + color.r.toString(16)).slice (-2)
             + ("0" + color.g.toString(16)).slice (-2)
             + ("0" + color.b.toString(16)).slice (-2)
      }
    };
    color.r = parseInt(rgbRight);
    color.g = parseInt(rgbRight);
    color.b = parseInt(rgbRight);
    $('.colorpick').colorpicker('setValue', color.value())
  }
};

var onload_func = function() {

  FxOSApp.init();

  //window.addEventListener('userproximity', FxOSApp.userproximity);
  //window.addEventListener('devicelight',FxOSApp.devicelight);

  $$('#imageSave').addEventListener('click', FxOSApp.service.save, false);

  $$('#shutter').addEventListener('click', FxOSApp.camera.shutter, false);

};
document.addEventListener('DOMContentLoaded', onload_func, false);
