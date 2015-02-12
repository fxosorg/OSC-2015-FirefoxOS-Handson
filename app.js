var server = 'http://fxos-ps.azurewebsites.net';
//var server = 'http://localhost:8000';
var api = server+'/api/photos';
var apiget = server+'/api/myphotos/';

//photoService.query('test', function(d){console.log('sucess!',d)});
//photoService.save(photo_data, function(d){console.log('sucess!',d)});
var photoService = {
  save: function(photo_data, callback){
    $.ajax({
      type: 'POST',
      data: JSON.stringify(photo_data),
      contentType: 'application/json',
      url: api,           
      success: callback
    });
  },
  query: function(username, callback){
    $.ajax({
      url: apiget + username,
      success: function(data){
        console.log('apiget!',data);
      },
      dataType: 'json'
    });
  }
};


$(function () { 
	var photFrame = document.getElementById('camera');

	if (photFrame.getContext) {
	
		var context = photFrame.getContext('2d');
		
		//左から20上から40の位置に、幅50高さ100の四角形を描く
		context.fillRect(20,40,50,100); 
		
		//色を指定する
		context.strokeStyle = 'rgb(00,00,255)'; //枠線の色は青
		context.fillStyle = 'rgb(255,00,00)'; //塗りつぶしの色は赤
		
		//左から200上から80の位置に、幅100高さ50の四角の枠線を描く
		context.strokeRect(200,80,100,50);
		
		//左から150上から75の位置に、半径60の半円を反時計回り（左回り）で描く
		context.arc(150,75,60,Math.PI*1,Math.PI*2,true);
		context.fill();
	
	};

    var base64 = '';
	$('#imageSave').click(function () {

		var photo_data = {
			img: photFrame.toDataURL(),
			usr: 'test'
		};
		
		photoService.save(photo_data, function(d){console.log('sucess!',d)});
		
	});
	
	$('#imageLoad').click(function () { 
		
		photoService.query('test', function(d){
			console.log('sucess!',d);
		})
		
	});
	
	$('#imageDelete').click(function () { 
		imageTable.del({}).then(function (del) {
			console.log('DELETE DONE:', del);
		 }, handleError);
	});
	 function handleError(error) {
        console.log('ERR:', error);
    }


/**************************  camera **************************/
// var options = {
//   mode: 'picture',
//   recorderProfile: 'jpg',
//   previewSize: {
//     width: 352,
//     height: 288
//   }
// };
// var camera = navigator.mozCameras.getListOfCameras()[0];
// function onSuccess(camera) {
//   // Do stuff with the camera
// };
// function onError(error) {
//   console.warn(error);
// };
// $('#shutter').click(function(){
//   navigator.mozCameras.getCamera(camera, options, onSuccess, onError);
// });



});
  

