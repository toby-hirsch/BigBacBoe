/**
*******LET'S BIG BAC BUCKING BO BITCHES**********************
* LIST OF FEATURES TO ADD
* *game timer with various lengths to choose
* *accounts
* * *saving games
* * *customizable boards
* * *invite user
* * *ratings
* *send user to unique URL for each game, allowing spectators or inviting by link
* *puzzles and mini games
* *tournaments
* *AI to play against
*/

/*var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'*/
var server = require('http').createServer(handler)
var io = require('socket.io')(server);
var fs = require('fs');

/*server.listen(server_port, server_ip_address, function () {
	console.log( "Listening on " + server_ip_address + ", port " + server_port )
});*/

server.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var games = {};
var playerMap = {};


const EMPTY = 0;
const RED = -1;
const BLACK = 1;
const EMPTY_BOARD = 
[
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

io.on('connection', function(socket) {
	socket.emit('printData', socket.id);
	
	var player = addPlayer(socket); //maybe change this to store the ID instead of the entire socket
	var game = games[player.gameID];
	if (game.players.length == 2)
		for (var i = 0 ; i < 2; i++)
			game.players[i].socket.emit('drawBoard');
	var state = game.boardState.state;
	var players;
	socket.on('processClick', function(clickCoord){
		console.log('******************************************CLICK******************************************');
		var spot = clickCoord[2];
		var b2 = clickCoord[1];
		var b1 = clickCoord[0];
		/*console.log('Click Coordinate: ' + clickCoord);
		console.log('Next Move: ' + game.boardState.nextMove);
		console.log(state[b1][b2][spot] == EMPTY);
		console.log(game.boardState.turn == player.color);
		console.log(checkMove(clickCoord, game.boardState.nextMove));
		console.log(typeof state[b1][b2]);*/
		if (typeof state[b1][b2] == 'object' && state[b1][b2][spot] == EMPTY && game.boardState.turn == player.color && checkMove(clickCoord, game.boardState.nextMove) && !game.boardState.winner){
			console.log('EXECUTING MOVE FOR ' + player.color);
			game.boardState.turn *= -1;
			state[b1][b2][spot] = player.color;
			console.log('LOGGING STATE OF BIG BAC FROM PROCESSCLICK');
			console.log(state[b1]);
			//console.log(state);
			if (checkWin(state[b1][b2], player.color)){
				console.log('bac won');
				state[b1][b2] = player.color;
				if (checkWin(state[b1], player.color)){
					console.log('big bac won');
					state[b1] = player.color;
					if (checkWin(state, player.color)){
						console.log('big bac bate');
						game.boardState.winner = player.color;
					}
				}
				
			}
			console.log('LOGGING STATE OF BAC FROM PROCESSCLICK');
			console.log(state[b1][b2]);
			if (isFilled(state[b1][b2], true)){ //throws an error because state[b1][b2] does not exist after a big bac is won
				state[b1][b2] = EMPTY;
				if (isFilled(state[b1], false)){
					state[b1] = EMPTY;
					if (isFilled(state, false))
						console.log('The game is tied');
				}
			}
			
			if (typeof state[b2] == 'number'){
				if (checkAllFilled(b2, state))
					game.boardState.nextMove = [9, 9];
				else
					game.boardState.nextMove = [9, spot];
			}
			else if (typeof state[b2][spot] == 'number')
				game.boardState.nextMove = [b2, 9];
			else
				game.boardState.nextMove = [b2, spot];
			console.log('updating next move to ' + game.boardState.nextMove);
			
			players = game.players;
			var len = players.length;
			var emission = game.boardState;
			for (var i = 0; i < len; i++)
				players[i].socket.emit('drawState', emission);
			//if (checkWin(state, player.color)) {
				//console.log(player.color + ' wins');
				//for (var i = 0; i < 2; i++)
					//players[i].socket.emit('endGame', player.color);
			//}
		}
		
	});
});



function addPlayer(socket){
	var player;
	var game;
	var gameKey;
	for (gameID in games){
		if (games[gameID].players.length < 2){
			game = games[gameID];
			gameKey = gameID;
			player = newPlayer(socket, RED);
			game.players.push(player);
		}
	}
	if (!game){
		player = newPlayer(socket, BLACK);
		gameKey = randomKey(GAME_ID_LEN);
		game = newGame(player, gameKey);
		games[gameKey] = game;
	}
	player.gameID = gameKey;
	playerMap[player.id] = gameKey;
	
	socket.emit('setColor', player.color);
	
	return player;
}

const winPossibilities = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];//3, 12, 21, 9, 12, 15, 12, 12

function checkAllFilled(b2, boardState){
	for (var i = 0; i < 9; i++)
		if (typeof boardState[i][b2] != 'number')
			return false;
	return true;
}

function checkLine(boardState, color, line){
	for (var i = 0; i < 3; i++)
		if (boardState[line[i]] != color)
			return false;
	console.log('WINNING LINE: ' + line);
	return true;
}

function checkMove(coords, nextMove){
	
	return (nextMove[0] == 9 || nextMove[0] == coords[0]) && (nextMove[1] == 9 || nextMove[1] == coords[1]);
}

function checkWin(boardState, color){
	console.log('CHECKING WIN');
	console.log(boardState);
	var len = winPossibilities.length;
	for (var i = 0; i < len; i++)
		if (checkLine(boardState, color, winPossibilities[i])){
			console.log('WINNING CALL');
			console.log(winPossibilities[i]);
			return true;
		}
	return false;
}

function clone2d(array){
	//console.log(array);
	var newState = [];
	var len = array.length;
	for (var i = 0; i < len; i++)
		newState.push(array[i].slice(0))
	return newState;
}

function isFilled(board, b2){
	if (!board)
		return false;
	console.log('LOGGING BOARD FROM ISFILLED');
	console.log(board);
	if (typeof board == 'number')
		return false;
	var len = board.length;
	for (var i = 0; i < len; i++)
		if (b2 && board[i] == EMPTY || typeof board[i] != 'number')
			return false;
	console.log('board is filled');
	return true;
}

function newGame(player, id){
	//console.log(EMPTY_BOARD);
	//console.log(EMPTY_BOARD[0][0].slice(0));
	var newState = [];
	//console.log(newState);
	for (var i = 0; i < 9; i++)
		newState.push(clone2d(EMPTY_BOARD[i]));
	return {
		id: id,
		players: [player],
		boardState: {
			state: newState,
			turn: BLACK,
			nextMove: [9, 9],
			winner: undefined
		},
	}
}

function newPlayer(socket, colorConstant){
	return {
		socket: socket,
		color: colorConstant
	}
}

const GAME_ID_LEN = 10;

function randomKey(len){
	var keyChars = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
	var key = [];
	for (var i = 0; i < len; i++)
		key.push(keyChars[Math.floor(Math.random() * keyChars.length)]);
	return key.join('');
}