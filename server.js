const env = 'production';

//Libraries

var express = require('express');
var app = module.exports = express();
var path = require('path');
var logger = require('morgan');
var secret = require('./secret.js')
var dotenv = require('dotenv');
const baseurl = env == 'development' ? 'http://localhost:8080' : 'http://www.bigbacboe.com';
var server_port = process.env.PORT || 8080;

var createError = require('http-errors');
var session = require("express-session")({
	secret: secret.express,
	resave: true,
	saveUninitialized: true,
	secure: env === 'production'
});
var url = require('url');
var bodyParser = require('body-parser');
var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
var sharedsession = require("express-socket.io-session");
var server = require('http').Server(app);
server.listen(server_port, function(){
	console.log( "Listening on port " + server_port );
});
var io = require('socket.io')(server, {
	allowEIO3: true
});

app.locals.baseurl = baseurl;

//Auth config

var oktaClient = new okta.Client({
	orgUrl: 'https://dev-796524.okta.com',
	token: secret.oktaToken
});
const oidc = new ExpressOIDC({
	issuer: "https://dev-796524.okta.com/oauth2/default",
	client_id: '0oaj0uejyD00a5BY7356',
	client_secret: secret.okta,
	redirect_uri: baseurl + '/users/callback',
	scope: "openid profile",
	routes: {
		login: {
			path: "/users/login"
		},
		callback: {
			path: "/users/callback",
			defaultRedirect: "/dashboard"
		}
	},
	appBaseUrl: baseurl
});

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
}

//Routing

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session);
app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var gamestore = require('./gamestore.js');

var indexRouter = require('./routes/public');
var dashboardRouter = require('./routes/dashboard');
var gameRouter = require('./routes/game');        

app.use('/dashboard', loginRequired, dashboardRouter);
app.use('/game', gameRouter);
app.use('/', indexRouter);

/*Database collections and structures:
	accounts
		username
		email
		password
	games
		state
		playerred
		playerblack
*/

//Board config

const EMPTY = 0;
const RED = -1;
const BLACK = 1;
const COLORS = {
	'1': 'black',
	'-1': 'red',
	'0': 'empty'
};
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

//Error Constants 
const PASSWORD_LENGTH_ERROR = 0;
const USER_TAKEN_ERROR = 1;
const INVALID_EMAIL_ERROR = 2;
const PASSWORD_MATCH_ERROR = 3;

io.use(sharedsession(session, {
    autoSave:true
}));

io.on('connection', function(socket) {
	var player, game, state, time, user;
	if (socket.handshake.session.passport)
		user = socket.handshake.session.passport.user.preferred_username;
	socket.emit('setid', socket.id);
	var socketloc = socket.handshake.headers.referer;
	
	if (socketloc.includes('/game/')){
		var gameID = socketloc.split('/game/')[1];
		if (socket.handshake.session.game && socket.handshake.session.game.id == gameID){
			game = gamestore.games[gameID];
			state = game.boardState.state;
			player = game.players[COLORS[socket.handshake.session.game.color]];
			player.socket = socket;
			socket.emit('initialize', player.color);
			socket.emit('drawState', game.boardState);
		}
		else if (user && user == gamestore.games[gameID].players.black.user){
			game = gamestore.games[gameID];
			state = game.boardState.state;
			player = game.players.black;
			player.socket = socket;
			socket.emit('initialize', BLACK);
			socket.emit('drawState', game.boardState);
		}
		else if (user && user == gamestore.games[gameID].players.red.user){
			game = gamestore.games[gameID];
			state = game.boardState.state;
			player = game.players.red;
			player.socket = socket;
			socket.emit('initialize', RED);
			socket.emit('drawState', game.boardState);
		}
		else{
			game = gamestore.games[gameID];
			if (!game)
				return;
			state = game.boardState.state;
			player = -1;
			socket.emit('initialize', EMPTY);
			socket.emit('drawState', game.boardState);
		}
		if (game.time == '0')
			socket.emit('timeunlim');
		socket.join(gameID);
	}
	
	
	socket.on('timeClicked', function(gameTime){
		player = addPlayer(socket, gameTime, user); //maybe change this to store the ID instead of the entire socket
		game = gamestore.games[player.gameID];
		if (game.players.black && game.players.red){
			console.log('STARTING GAME');
			time = startTimer(game);
			for (var p in game.players){
				game.players[p].socket.handshake.session.game = {id: game.id, color: game.players[p].color};
				game.players[p].socket.handshake.session.save();
			}
			io.to(game.id).emit('redirect', baseurl + '/game/' + game.id);
			
		}
		state = game.boardState.state;
	});
	
	
	var players;
	socket.on('processClick', function(clickCoord){
		if (player == -1)
			return;
		var spot = clickCoord[2];
		var b2 = clickCoord[1];
		var b1 = clickCoord[0];
		if (game.boardState.turn == player.color && typeof state[b1][b2] == 'object' && state[b1][b2][spot] == EMPTY && checkMove(clickCoord, game.boardState.nextMove) && !game.boardState.winner){
			game.boardState.turn *= -1;
			state[b1][b2][spot] = player.color;
			if (checkWin(state[b1][b2], player.color)){
				state[b1][b2] = player.color;
				if (checkWin(state[b1], player.color)){
					state[b1] = player.color;
					if (checkWin(state, player.color)){
						game.boardState.winner = player.color;
					}
				}
			}
			if (isFilled(state[b1][b2], true)){
				state[b1][b2] = EMPTY;
				if (isFilled(state[b1], false)){
					state[b1] = EMPTY;
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
			
			players = game.players;
			var len = players.length;
			var emission = game.boardState;
			io.to(game.id).emit('drawState', emission);
		}
	});	
});

/* 
	* socket: Socket of the current user
	* gameTime: Desired game length
	* user: the username of the current user
		
	Tries to find a game with one player of the approporiate length
	  If successful, it calls newPlayer with red and adds the player to that game
	  If unsuccessful, it calls newPlayer with black, creates a game and adds the player to the game
*/

function addPlayer(socket, gameTime, user){
	var player;
	var game;
	var gameKey;
	for (gameID in gamestore.games){
		if (!gamestore.games[gameID].players.red && gamestore.games[gameID].time == gameTime){ //When you randomize the colors, this wont work
			game = gamestore.games[gameID];
			gameKey = gameID;
			player = newPlayer(socket, RED, user);
			game.players.red = player;
		}
	}
	if (!game){
		player = newPlayer(socket, BLACK, user);
		gameKey = randomKey(GAME_ID_LEN);
		game = newGame(player, gameKey, gameTime);
		gamestore.games[gameKey] = game;
	}
	player.gameID = gameKey;
	socket.join(gameKey);
	
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
	return true;
}

function checkMove(coords, nextMove){
	
	return (nextMove[0] == 9 || nextMove[0] == coords[0]) && (nextMove[1] == 9 || nextMove[1] == coords[1]);
}

function checkWin(boardState, color){
	var len = winPossibilities.length;
	for (var i = 0; i < len; i++)
		if (checkLine(boardState, color, winPossibilities[i])){
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
	if (typeof board == 'number')
		return false;
	var len = board.length;
	for (var i = 0; i < len; i++)
		if (b2 && board[i] == EMPTY || typeof board[i] != 'number')
			return false;
	return true;
}


/* newGame documentation
	Returns a game object. Structure:
		id,
		players{
			black,
			red
		},
		boardstate{
			state,
			turn,
			nextMove,
			winner
		},
		times{
			black,
			red
		},
		time
*/

function newGame(player, id, gameTime){
	var newState = [];
	for (var i = 0; i < 9; i++)
		newState.push(clone2d(EMPTY_BOARD[i]));
	return {
		id: id,
		players: {
			'black': player,
			'red': undefined
		},
		boardState: {
			state: newState,
			turn: BLACK,
			nextMove: [9, 9],
			winner: undefined
		},
		times: {
			black: parseInt(gameTime) * 60,
			red: parseInt(gameTime) * 60
		},
		time: gameTime
	}
}

function newPlayer(socket, colorConstant, user){
	return {
		socket: socket,
		user: user,
		color: colorConstant
	}
}

const GAME_ID_LEN = 12;

function randomKey(len){
	var keyChars = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
	var key = [];
	for (var i = 0; i < GAME_ID_LEN; i++)
		key.push(keyChars[Math.floor(Math.random() * keyChars.length)]);
	return key.join('');
}

function startTimer(game){
	if (game.time == '0'){
		game.times = undefined;
		return;
	}
	
	var time = game.times.black = game.times.red = game.time * 60;
	var turn;
	
	var gameTimer = setInterval(function(){ //Increase the interval on this and only check if the time should be zero after restructuring to store time in database
		turn = game.boardState.turn;
		if (turn == BLACK){
			game.times.black = game.times.black - 1;
			if (game.times.black == 0){
				game.boardState.winner = RED;
				clearInterval(gameTimer);
				io.to(game.id).emit('drawState', game.boardState);
			}
		}
		else if (turn == RED){
			game.times.red = game.times.red - 1;
			if (game.times.red == 0){
				game.boardState.winner = BLACK;
				clearInterval(gameTimer);
				io.to(game.id).emit('drawState', game.boardState);
			}
		}
		io.to(game.id).emit('timer', game.times);
		
	}, 1000)
	
	return time;
	
}