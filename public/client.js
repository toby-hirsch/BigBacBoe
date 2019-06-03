var socket = io(window.location.hostname);
var id;

const BOARD_LENGTH = 570;
const BOARD_THIRD = BOARD_LENGTH / 3;
const B1_BUFFER = 5;
const B1_SQUARE_LEN = (BOARD_THIRD - 2 * B1_BUFFER) / 3;
const B2_BUFFER = 3;
const B2_SQUARE_LEN = (B1_SQUARE_LEN - 2 * B2_BUFFER) / 3;
const B3_BUFFER = 2;

const B0_COLOR = 'black';
const B1_COLOR = 'green';
const B2_COLOR = 'purple';

const BLACK = 1;
const RED = -1;
const EMPTY = 0;

var loggedon = false;

const EMPTY_BOARD = [
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	],
	[
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
	]
];


var color;
var canvas;
var ctx;
var gameOver = false;


socket.on('drawState', function(state){
	drawState(state);
});


socket.on('initialize', function(code){
	var statusDiv = $('#status');
	canvas = document.getElementById('board');
	ctx = canvas.getContext('2d');
	switch(code){
		case BLACK: 
			canvas.addEventListener('click', function clicked(event){boardListener(event)});
			statusDiv.html('You have the <span>black</span> Xs');
			statusDiv.children('span').css('color', 'black');
			break;
		case RED: 
			canvas.addEventListener('click', function clicked(event){boardListener(event)});
			statusDiv.html('You have the <span>red</span> Xs');
			statusDiv.children('span').css('color', 'red');
			break;
		case EMPTY: 
			statusDiv.text('You are observing');
			break;
	}
	color = code;
});


socket.on('printData', function(data){
	console.log(data);
});


socket.on('redirect', function(loc){
	window.location.href = loc;
});


socket.on('setid', function(pid){
	id = pid;
	console.log(id);
});


/*socket.on('showButtons', function(){
	var timeButtons = document.querySelectorAll('.timeButtons');
	var len = timeButtons.length;
	console.log(timeButtons);
	for (var i = 0; i < len; i++){
		var buttonID = timeButtons[i].id;
		console.log(i);
		timeButtons[i].addEventListener('click', function(){
			setTimer(parseInt(this.id), socket);
		});
		console.log('done adding');
	}
});*/


$('.joingame').on('click', function(){
	setTimer($(this).attr('id'));
});





socket.on('timer', function(times){
	console.log(times);
	document.getElementById('timerRed').innerHTML = Math.floor(times.red / 60).toString().padStart(2, '0') + ':' + (times.red % 60).toString().padStart(2, '0');
	document.getElementById('timerBlack').innerHTML = Math.floor(times.black / 60).toString().padStart(2, '0') + ':' + (times.black % 60).toString().padStart(2, '0');
});


$('.navlink').click(function(){
	redirect($(this).attr('data-to'));
});


function boardListener(event){
	if (gameOver)
		return;
	var clickCoords = processClick(event, canvas);
	console.log('clickCoords ' + clickCoords.join(''));
	if (checkCoords(clickCoords))
		socket.emit('processClick', clickCoords);
}


function checkCoords(coords){
	var len = coords.length;
	for (var i = 0; i < len; i++)
		if (typeof coords[i] === 'undefined')
			return false;
	return true;
}


function drawBoard(x1, y1, length, color){
	ctx.beginPath()
	ctx.strokeStyle = color;
	
	ctx.moveTo(x1 + length / 3, y1);
	ctx.lineTo(x1 + length / 3, y1 + length);
	
	ctx.moveTo(x1 + 2 * length / 3, y1);
	ctx.lineTo(x1 + 2 * length / 3, y1 + length);
	
	ctx.moveTo(x1, y1 + length / 3);
	ctx.lineTo(x1 + length, y1 + length / 3);
	
	ctx.moveTo(x1, y1 + 2 * length / 3);
	ctx.lineTo(x1 + length, y1 + 2 * length / 3);
	
	ctx.stroke();
}


function drawState(boardState){
	console.log(boardState);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var state = boardState.state;
	var nextMove = boardState.nextMove;
	var turn = boardState.turn;
	
	if (!boardState.winner)
		if (nextMove[0] == 9)
			if (nextMove[1] == 9)
				highlightAll(turn);
			else
				for (var i = 0; i < 9; i++)
					highlight([i, nextMove[1]], turn);
		else
			if (nextMove[1] == 9)
				for (var i = 0; i < 9; i++)
					highlight([nextMove[0], i], turn);
			else
				highlight(nextMove, turn);
							
	
	drawBoard(0, 0, BOARD_LENGTH, B0_COLOR);
	var length = BOARD_THIRD - 2 * B1_BUFFER;
	for (var i = 0; i < 9; i++){
		//console.log('Drawing Big Bac ' + i);
		switch(state[i]){ //This should probably be recursive somehow, call itself in the default case
			case EMPTY: console.log('empty');break;
			case BLACK:
				console.log('black');
				drawX(B1_BUFFER, B1_BUFFER, i, BOARD_THIRD, length, 'black');
				break;
			case RED:
				console.log('red');
				drawX(B1_BUFFER, B1_BUFFER, i, BOARD_THIRD, length, 'red');
				break;
			default:
				//console.log('ENTERING B1s');
				var x = B1_BUFFER + (i % 3) * BOARD_THIRD;
				var y = B1_BUFFER + Math.floor(i / 3) * BOARD_THIRD;
				var len = B1_SQUARE_LEN - 2 * B2_BUFFER;
				var moveX1 = x + B2_BUFFER;
				var moveY1 = y + B2_BUFFER;
				drawBoard(x, y, length, B1_COLOR);
				for (var j = 0; j < 9; j++){
					switch(state[i][j]){
						case EMPTY: break; //come up with way to represent filled, tied boards
						case BLACK:
							console.log('DRAWING BLACK X');
							drawX(moveX1, moveY1, j, B1_SQUARE_LEN, len, 'black');
							break;
						case RED:
							console.log('DRAWING RED X');
							drawX(moveX1, moveY1, j, B1_SQUARE_LEN, len, 'red');
							break;
						default:
							//console.log('ENTERING B2S')										
							var localX = x + (j % 3) * B1_SQUARE_LEN + B2_BUFFER;
							var localY = y + (Math.floor(j / 3) * B1_SQUARE_LEN) + B2_BUFFER;
							var locLen = B2_SQUARE_LEN - 2 * B3_BUFFER;
							var moveX = localX + B3_BUFFER;
							var moveY = localY + B3_BUFFER;
							drawBoard(localX, localY, len, B2_COLOR);
							for (var k = 0; k < 9; k++){
								switch(state[i][j][k]){
									case EMPTY: break;
									case BLACK:
										console.log('DRAWING BLACK X');
										drawX(moveX, moveY, k, B2_SQUARE_LEN, locLen, 'black');
										break;
									case RED:
										console.log('DRAWING RED X');
										drawX(moveX, moveY, k, B2_SQUARE_LEN, locLen, 'red');
										break;
								}
							}
					}
				}
		}
	}
	
	if (boardState.winner)
		endGame(boardState.winner);
	
}


function drawX(startX, startY, locCoord, increment, len, color){
	ctx.beginPath();
	ctx.strokeStyle = color;
	var x = startX + (locCoord % 3) * increment;
	var y = startY + Math.floor(locCoord / 3) * increment;
	var endX = x + len;
	var endY = y + len;
	console.log('drawing from ' + x + ', ' + y + ' to ' + endX + ', ' + endY);
	ctx.moveTo(x, y);
	ctx.lineTo(endX, endY);
	ctx.moveTo(endX, y);
	ctx.lineTo(x, endY);
	/*if (coord.length == 1){
		var coordI = coord[0];
		var x = coordI % 3;
		var y = Math.floor(coordI / 3);
		
		ctx.moveTo(x * BOARD_THIRD, y * BOARD_THIRD);
		ctx.lineTo(x * BOARD_THIRD + BOARD_THIRD, y * BOARD_THIRD + BOARD_THIRD);
		ctx.moveTo(x * BOARD_THIRD + BOARD_THIRD, y * BOARD_THIRD);
		ctx.lineTo(x * BOARD_THIRD, y * BOARD_THIRD + BOARD_THIRD);
		
	}
	else {
		var x1 = coord[0] % 3;
		var y1 = Math.floor(coord[0] / 3);
		var x2 = coord[1] % 3;
		var y2 = Math.floor(coord[1] / 3);
		var left = x1 * BOARD_THIRD + B1_BUFFER + x2 * B1_SQUARE_LEN;
		var top = y1 * BOARD_THIRD + B1_BUFFER + y2 * B1_SQUARE_LEN;
		
		ctx.moveTo(left, top);
		ctx.lineTo(left + B1_SQUARE_LEN, top + B1_SQUARE_LEN);
		ctx.moveTo(left + B1_SQUARE_LEN, top);
		ctx.lineTo(left, top + B1_SQUARE_LEN);
	}*/
	ctx.stroke();
}


function endGame(colorConst){
	console.log('Game Over');
	gameOver = true;
	var winner;
	switch (colorConst){
		case BLACK:
			winner = 'Black';
			break;
		case RED:
			winner = 'Red';
			break;
	}
	var endResult = document.createElement('div');
	document.body.insertBefore(endResult, document.getElementById('timerBlack'));
	endResult.innerHTML = winner + ' wins';
}


function getCoord(boardX, boardY, length, buffer, x, y){
	var xCoord, yCoord;
	var relX = x - boardX;
	var relY = y - boardY;
	var boardLen = length - 2 * buffer; //
	var borderOne = buffer + boardLen / 3;
	var borderTwo = buffer + 2 * boardLen / 3;
	if (relX < borderOne - 2 && relX > buffer)
		xCoord = 0;
	else if (relX < borderTwo - 2 && relX > borderOne + 2)
		xCoord = 1;
	else if (relX > borderTwo + 2 && relX < length - buffer)
		xCoord = 2;
	else
		return;
	if (relY < borderOne - 2 && relY > buffer)
		yCoord = 0;
	else if (relY < borderTwo - 2 && relY > borderOne + 2)
		yCoord = 1;
	else if (relY > borderTwo + 2 && relY < length - buffer)
		yCoord = 2;
	else
		return;
	return xCoord + 3 * yCoord;
}


function highlightAll(color){
	if (color == BLACK)
		ctx.fillStyle = 'rgba(0, 0, 0, .2)';
	else if (color == RED)
		ctx.fillStyle = 'rgba(255, 0, 0, .2)';
	
	ctx.fillRect(0, 0, BOARD_LENGTH, BOARD_LENGTH);
}


function highlight(coord, color) {
				
	if (color == BLACK)
		ctx.fillStyle = 'rgba(0, 0, 0, .2)';
	else if (color == RED)
		ctx.fillStyle = 'rgba(255, 0, 0, .2)';

	var x1 = coord[0] % 3;
	var y1 = Math.floor(coord[0] / 3);
	var x2 = coord[1] % 3;
	var y2 = Math.floor(coord[1] / 3);
	
	ctx.fillRect(B1_BUFFER + x1 * BOARD_THIRD + x2 * B1_SQUARE_LEN, B1_BUFFER + y1 * BOARD_THIRD + y2 * B1_SQUARE_LEN, B1_SQUARE_LEN, B1_SQUARE_LEN);
}


function processClick(event, canvas){
	var rect = canvas.getBoundingClientRect();
	var x = event.x - rect.left;
	var y = event.y - rect.top;
	var coordOne = getCoord(0, 0, BOARD_LENGTH, 0, x, y);
	var boardX = (coordOne % 3) * BOARD_THIRD;
	var boardY = Math.floor(coordOne / 3) * BOARD_THIRD;
	var coordTwo = getCoord(boardX, boardY, BOARD_THIRD, B1_BUFFER, x, y);
	
	boardX += B1_BUFFER + (coordTwo % 3) * B1_SQUARE_LEN;
	boardY += B1_BUFFER + Math.floor(coordTwo / 3) * B1_SQUARE_LEN;
	console.log('BOARD COORDS: ' + boardX + ', ' + boardY);
	console.log('CLICK COORDS: ' + x + ', ' + y);
	console.log(B1_SQUARE_LEN + ', ' + B2_BUFFER);
	var coordThree = getCoord(boardX, boardY, B1_SQUARE_LEN, B2_BUFFER, x, y);
	
	console.log(coordOne + ', ' + coordTwo + ', ' + coordThree);
	
	return [coordOne, coordTwo, coordThree];
}


function redirect(page){
	console.log('redirecting to ' + page);
	console.log($('.active'));
	$('.active').removeClass('active').fadeOut(200, function(){
		$('#' + page).removeClass('inactive').addClass('active').fadeIn(500);
	});
}


function setTimer(id){
	$('.timeButtons').remove();
	redirect('waitingDiv');
	window.setTimeout(function(){socket.emit('timeClicked', id);}, 700);
}