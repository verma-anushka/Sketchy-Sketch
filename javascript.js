$(function(){

	// Declaring variables
	var paint = false; // painting/erasing
	var paint_erase = "paint"; // paint mode / erase mode
	// canvas and context
	var canvas = document.getElementById('board');
	var ctx = canvas.getContext('2d');
	var container = $("#container"); 

	// To change the color on the rectangle, just manipulate the context
	ctx.strokeStyle = "#000";
	ctx.fillStyle = "#FFF";
	roundRect(ctx, 0, 0, 800, 600, 18, true);
	// roundRect(ctx, 100, 5, 100, 100, 20, true);

	function roundRect(ctx, x, y, width, height, radius, fill, stroke){
	  if(typeof stroke == 'undefined') {
	    stroke = true;
	  }
	  if(typeof radius === 'undefined') {
	    radius = 5;
	  }
	  if(typeof radius === 'number') {
	    radius = {tl: radius, tr: radius, br: radius, bl: radius};
	  } else {
	    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	    for(var side in defaultRadius) {
	      radius[side] = radius[side] || defaultRadius[side];
	    }
	  }
	  ctx.beginPath();
	  ctx.moveTo(x + radius.tl, y);
	  ctx.lineTo(x + width - radius.tr, y);
	  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	  ctx.lineTo(x + width, y + height - radius.br);
	  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	  ctx.lineTo(x + radius.bl, y + height);
	  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	  ctx.lineTo(x, y + radius.tl);
	  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	  ctx.closePath();
	  if (fill) {
	    ctx.fill();
	  }
	  if (stroke) {
	    ctx.stroke();
	  }

	}
	// mouse position(coordinates of mouse inside the container) - obj
	var mouse = {x: 0, y: 0};

	// On reloading the page, load the saved work from localStorage
	if(localStorage.getItem("imgCanvas") != null){
		// Creating an img using Image Constructor
		var img = new Image();

		// To load the image
		img.onload = function(){
			// Using context to draw the img
			ctx.drawImage(img, 0, 0);
		}
		// Setting the source of the img
		img.src = localStorage.getItem("imgCanvas");

	}

	// Drawing parameters
	// initial line width
	ctx.lineWidth = 3;
	ctx.lineCap = "round"; // butt, square
	ctx.lineJoin = "round"; // bevel, miter

	// On clicking inside the container
	container.mousedown(function(event){
		// Paint mode on
		paint = true;
		// To check the current mode
		// window.alert(paint);

		// To draw, hold the mouse key and drag
		ctx.beginPath();
		// mouse coordinates: dist b/w mouse and pg - dist b/w container and pg
		mouse.x = event.pageX - this.offsetLeft;
		mouse.y = event.pageY - this.offsetTop;
		ctx.moveTo(mouse.x,mouse.y);
	});

	// Dragging mouse (while holding)
	container.mousemove(function(event){
		
		// Tracking mouse coordinates
		mouse.x = event.pageX - this.offsetLeft;
		mouse.y = event.pageY - this.offsetTop;

		// Checking if painting or erasing
		if(paint){
			if(paint_erase == "paint"){
				// Start Painting
				// Line Color
				ctx.strokeStyle = $("#paintColor").val();
			}else{
				// Start Erasing
				ctx.strokeStyle = "#FFF";
			}
			ctx.lineTo(mouse.x,mouse.y);
			ctx.stroke();
		}
	});

	// Stop painting/erasing
	container.mouseup(function(){
		paint = false;
	});

	// On moving out of the board area
	container.mouseleave(function(){
		paint = false;
	});

	// Erase button
	$("#erase").click(function(){

		// Toggle between paint and erase
		if(paint_erase == "paint"){
			paint_erase = "erase";
		}else{
			paint_erase = "paint";
		}

		$(this).toggleClass("eraseMode");
	});

	// Reset
	$("#reset").click(function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = "#000";
		ctx.fillStyle = "#FFF";
		roundRect(ctx, 0, 0, 800, 600, 18, true);
		paint_erase = "paint";
		$("#erase").removeClass("eraseMode");
	});

	// Save
	$("#save").click(function(){
		// Using localStorage(no expiration time)[sessionStorage:has expiration time]

		// Checking if the browser supports localStorage
		if(typeof(localStorage) != null){
			// returns a url containing the graphical data
			localStorage.setItem("imgCanvas",canvas.toDataURL());
			// window.alert(localStorage.getItem("imgCanvas"));
		}else{
			window.alert("Your browser doesn't support localStorage");
		}
	});

	// On changing the color
	$("#paintColor").change(function(){
		$("#circle").css("background-color",$(this).val());
	});

	// On changing the line width
	$("#slider").slider({
		min: 3,
		max: 30,
		slide: function(event, ui){
			$("#circle").height(ui.value);
			$("#circle").width(ui.value);
			ctx.lineWidth = ui.value;
		}
	});

});

// var canvas = document.getElementById('board');
// 	// returns the drawing object of canvas
// 	var context = canvas.getContext('2d'); 

// 	// Drawing a Line 
// 	// Declare new path
// 	context.beginPath();

// 	context.lineWidth = 20;
// 	context.strokeStyle = "red";

// 	// Styling edges
// 	context.lineCap = "round"; // butt, square
// 	context.lineJoin = "round"; // bevel, miter

// 	// Starting point
// 	context.moveTo(50,50);

// 	// Straight line from starting point to new position
// 	context.lineTo(200,200)
// 	context.lineTo(400,100)

// 	// To make line visible
// 	context.stroke();