
/************************** edit **************************/
(function(){
  var canvas = document.getElementById("camera"),
      ctx = canvas.getContext("2d"),
      painting = false, lastX = 0, lastY = 0, lineThickness = 1;
  var point={
    X:function(e){return e.pageX===0?e.changedTouches[0].pageX:e.pageX;},
    Y:function(e){return e.pageY===0?e.changedTouches[0].pageY:e.pageY;},
  }

  var events={
    start:function(e) {
      console.log('start');
      history.saveState(canvas);
      painting = true;
      ctx.fillStyle = "#000000";
      lastX = point.X(e) - this.offsetLeft;
      lastY = point.Y(e) - this.offsetTop;
    },
    end:function(e){
      console.log('end');
      painting = false;
    },
    move:function(e) {
      console.log('move', painting);

      if (painting) {

        mouseX = point.X(e) - this.offsetLeft;
        mouseY = point.Y(e) - this.offsetTop;

        var x1 = mouseX, x2 = lastX, y1 = mouseY, y2 = lastY;
        var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
        if (steep){
          var x = x1; x1 = y1; y1 = x;
          var y = y2; y2 = x2; x2 = y;
        }
        if (x1 > x2) {
          var x = x1; x1 = x2; x2 = x;
          var y = y1; y1 = y2; y2 = y;
        }

        var dx = x2 - x1, dy = Math.abs(y2 - y1), error = 0, de = dy / dx, yStep = -1, y = y1;

        if (y1 < y2) {
          yStep = 1;
        }

        lineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
        if(lineThickness < 1){
          lineThickness = 1;   
        }

        for (var x = x1; x < x2; x++) {
          if (steep) ctx.fillRect(y, x, lineThickness , lineThickness );
          else ctx.fillRect(x, y, lineThickness , lineThickness );

          error += de;
          if (error >= 0.5) {
            y += yStep;
            error -= 1.0;
          }
        }
        lastX = mouseX;
        lastY = mouseY;
      }
    }
  };
  canvas.addEventListener("touchstart", events.start, false);
  canvas.addEventListener("touchend",   events.end, false);
  canvas.addEventListener("touchmove",  events.move, false);
  canvas.onmousedown = events.start;
  canvas.onmouseup = events.end;
  canvas.onmousemove = events.move;

  
  var history = {
    redo_list: [],
    undo_list: [],
    saveState: function(canvas, list, keep_redo) {
      keep_redo = keep_redo || false;
      if(!keep_redo) {
        this.redo_list = [];
      }
      
      (list || this.undo_list).push(canvas.toDataURL());   
    },
    undo: function(canvas, ctx) {
      this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
    },
    redo: function(canvas, ctx) {
      this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
    },
    restoreState: function(canvas, ctx,  pop, push) {
      if(pop.length) {
        this.saveState(canvas, push, true);
        var restore_state = pop.pop();
        var img = document.createElement("img");
        img.onload = function() {
          ctx.clearRect(0, 0, 600, 400);
          ctx.drawImage(img, 0, 0);  
        }
        img.src = restore_state;
      }
    }
  }
  $('#undo').on('click', function() {history.undo(canvas, ctx);});
  $('#redo').on('click', function() {history.redo(canvas, ctx);});

})();