/**
* LIST OF FEATURES TO ADD
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

/*
Authorization info:
Client ID: 0oaj0uejyD00a5BY7356
Client Password: yWb5NZ0KS8svF48cCjUzbwf4wtuCD8LrXjsoToKe
Token Value: 00-deE4vkSIclxHR22fkgLekWEm2Qv2S4dAYR8J2k4

*/

//const baseurl = 'http://localhost:5000';
const baseurl = 'http://www.bigbacboe.com';
var server_port = process.env.PORT || 8080;
/*var server = require('http').createServer(handler)
var io = require('socket.io')(server);
var fs = require('fs');

var express = require('express');
var app = express();
app.set('view engine', 'ejs');*/


/*
Store games in database with BOTH a socket and a user
	*Game object, emailOne and emailTwo
		*Game object stores all usual information, but instead of storing game times, it stores a time object for each player
			*last: time remaining as of last move
			*lastMove: undefined if it is not their turn, otherwise the time at which the last move was played
		*Time is calculated by doing last - (currTime - lastMove)
	*Game object is only updated when a move is played
		*When game object is updated, it is sent back to client to display timer, which is calculated client sidebar
		*Server checks all games in database on certain interval for time expiring
	*Each game is a room with all the sockets connected to that URL
	*Anyone can connect to the URL to watch the game
	*Block clicking for anyone who is not part of the game on client side; also check on server side that any clicks submitted come from either the appropriate socket or user.

Restructure socket.io on connection code
	*When user hits new game button, that triggers socket event that sets the game, player, etc. for that socket
	*When user hits join existing game, the player is redirected to that game's url and a different socket event is triggered
		*sets the game, player, etc. for that socket
		*changes the player object in the game to have the new socket
		*adds the new socket to the game's namespace
	*on disconnect, clear the game object of the socket (maybe unnecessary)
	*parse URL to see if someone is connecting directly to a game URL. If so:
		*add them to the game namespace
		*see if they are logged in with the account of one of the users; if so, emit telling them which color they are (add this emission to normal games too)
*/

var express = require('express');
var app = module.exports = express();
app.locals.baseurl = baseurl;
var createError = require('http-errors');
var path = require('path');
var logger = require('morgan');

var dotenv = require('dotenv');

var session = require("express-session")({
	secret: 'liuwehmciauhpgawutyapwuiynhali47ybp9274tr8o73i4u5yar2937irby2973qp9t843pyna984tyl9wzi84styhg92I4UTYWGHPSV',
	resave: true,
	saveUninitialized: true,
	//secure: app.get('env') === 'production'
});

var url = require('url');

//var passport = require('passport');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var Auth0Strategy = require('passport-auth0');

var okta = require("@okta/okta-sdk-nodejs");
var ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

var sharedsession = require("express-socket.io-session");


//dotenv.config();

/*var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/dashboard'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);*/



/*passport.use(strategy);

passport.serializeUser(function (user, done) {
  console.log('serializing user');
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log('deserializing user');
  console.log(user);
  done(null, user);
});*/



app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser('liuwehmciauhpgawutyapwuiynhali47ybp9274tr8o73i4u5yar2937irby2973qp9t843pyna984tyl9wzi84styhg92I4UTYWGHPSV'));





var oktaClient = new okta.Client({
	orgUrl: 'https://dev-796524.okta.com',
	token: '00-deE4vkSIclxHR22fkgLekWEm2Qv2S4dAYR8J2k4'
});
const oidc = new ExpressOIDC({
	issuer: "https://dev-796524.okta.com/oauth2/default",
	client_id: '0oaj0uejyD00a5BY7356',
	client_secret: '_SBPKd5D_2gXN3YYQ1CwNdhqXCSpzHsn94TohDGf',
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
	}
});

app.use(session);
app.use(oidc.router);

app.use((req, res, next) => { //more Okta
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

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }

  next();
}

//app.use(passport.initialize());
//app.use(passport.session());




var server = require('http').Server(app);
server.listen(server_port, function(){
	console.log( "Listening on port " + server_port );
});
var io = require('socket.io')(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());


var gamestore = require('./gamestore.js');

app.use(express.urlencoded({ extended: false }));



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


/*app.post('/registrationForm', [
	check('password').isLength({min: 8}).withMessage('password not long enough'),
	check('email').isEmail().withMessage(INVALID_EMAIL_ERROR)
	], (req, res) => {
	const errors = validationResult(req);
	console.log(errors.array());
	const content = req.body;
	const id = content.socketid;
	console.log(id);
	var query;
	if (db.collection('accounts').count({username: content.username}) != 0){
		io.to('${' + id + '}').emit('registrationerror', USER_TAKEN_ERROR);
		res.end();
		return;
	}
	if (!errors.isEmpty()){
		io.to('${' + id + '}').emit('registrationerror', parseInt(errors.array()[0].msg));
		res.end();
		return;
	}
	if (content.password != content.passwordConfirm){
		io.to('${' + id + '}').emit('registrationerror', PASSWORD_MATCH_ERROR);
		res.end();
		return;
	}
	
	res.redirect('/');
	db.collection('accounts').insert({
		username: content.username, email: content.email, password: content.password
	});
	
	res.end();
});*/

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


var playerMap = {};


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

//{	Error Constants 
const PASSWORD_LENGTH_ERROR = 0;
const USER_TAKEN_ERROR = 1;
const INVALID_EMAIL_ERROR = 2;
const PASSWORD_MATCH_ERROR = 3;
//}


io.use(sharedsession(session, {
    autoSave:true
}));

io.on('connection', function(socket) {
	var player, game, state, time, user;
	if (socket.handshake.session.passport)
		user = socket.handshake.session.passport.user.preferred_username;
	socket.emit('setid', socket.id);
	console.log('**************************NEW CONNECTION.****************************************');
	console.log('Session object: ');
	console.log(socket.handshake.session); //The session.game object does not exist here
	var socketloc = socket.handshake.headers.referer;
	console.log(socketloc);
	
	/*
	  All of this section is redundant and should be removed
	  This is calculated in the game.js routes
	  Find a way to transmit the information in the session instead of recalculating is
	*/
	
	if (socketloc.includes('/game/')){
		console.log('Socket joining a game');
		console.log(socket.handshake.session.game);
		console.log(user);
		var gameID = socketloc.split('/game/')[1];
		if (socket.handshake.session.game && socket.handshake.session.game.id == gameID){
			console.log('Adding playing priveliges from socket session');
			game = gamestore.games[gameID];
			state = game.boardState.state;
			player = game.players[COLORS[socket.handshake.session.game.color]];
			player.socket = socket;
			socket.emit('initialize', player.color);
			socket.emit('drawState', game.boardState);
		}
		else if (user && user == gamestore.games[gameID].players.black.user){
			console.log('Adding playing priveliges for black user');
			game = gamestore.games[gameID];
			state = game.boardState.state;
			player = game.players.black;
			player.socket = socket;
			socket.emit('initialize', BLACK);
			socket.emit('drawState', game.boardState);
		}
		else if (user && user == gamestore.games[gameID].players.red.user){
			console.log('Adding playing priveliges for red user');
			game = gamestore.games[gameID];
			state = game.boardState.state;
			player = game.players.red;
			player.socket = socket;
			socket.emit('initialize', RED);
			socket.emit('drawState', game.boardState);
		}
		else{
			console.log('Adding observer priveliges');
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
		console.log('Printing game');
		console.log(game);
		if (game.players.black && game.players.red){
			console.log('STARTING GAME');
			time = startTimer(game);
			for (var p in game.players){
				game.players[p].socket.handshake.session.game = {id: game.id, color: game.players[p].color};
				game.players[p].socket.handshake.session.save();
				console.log('Socket session');
				console.log(game.players[p].socket.handshake.session);
			}
			io.to(game.id).emit('redirect', baseurl + '/game/' + game.id);
			
		}
		state = game.boardState.state;
	});
	
	
	var players;
	socket.on('processClick', function(clickCoord){
		if (player == -1)
			return;
		console.log('******************************************CLICK******************************************');
		console.log(clickCoord);
		var spot = clickCoord[2];
		var b2 = clickCoord[1];
		var b1 = clickCoord[0];
		console.log('Turn: ' + game.boardState.turn);
		console.log('Player color: ' + player.color);
		if (game.boardState.turn == player.color && typeof state[b1][b2] == 'object' && state[b1][b2][spot] == EMPTY && checkMove(clickCoord, game.boardState.nextMove) && !game.boardState.winner){
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
			io.to(game.id).emit('drawState', emission);
			//if (checkWin(state, player.color)) {
				//console.log(player.color + ' wins');
				//for (var i = 0; i < 2; i++)
					//players[i].socket.emit('endGame', player.color);
			//}
		}
	});	
});

/* addPlayer documentation
	Parameters:
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
	playerMap[player.id] = gameKey;
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
	console.log('printing game time');
	console.log(game.time);
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