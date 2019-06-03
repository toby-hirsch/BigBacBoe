const express = require('express');

const router = express.Router();

var games = require('../gamestore.js').games;

const EMPTY = 0;
const RED = -1;
const BLACK = 1;

router.get('*', (req, res) => {
	var user;
	if (req.session.passport)
		user = req.session.passport.user.preferred_username;
	var url = req.originalUrl;
	var gameID = url.substring(6);
	var game, redPlayer, blackPlayer, playerColor;
	console.log('URL: ' + gameID);
	if (exists(gameID)){
		game = games[gameID];
		if (req.session.game && req.session.game.id == gameID){
			console.log('Recognized redirect');
			playerColor = req.session.game.color;
		}
		else if (user && user == games[gameID].players.black.user){
			console.log('Matched user with black player');
			playerColor = BLACK;
		}
		else if (user && user == games[gameID].players.red.user){
			console.log('Matched user with red player');
			playerColor = RED;
		}
		else{
			console.log('Did not recognize player; proceeding as observer');
			playerColor = EMPTY;
		}
		res.render('game', {
			color: playerColor,
			redPlayer: game.players.red.user || 'Guest User',
			blackPlayer: game.players.black.user || 'Guest User'
		});
	}
	else
		res.render('error');
});

function exists(id){
	for (key in games)
		if (games[key].id == id)
			return true;
	return false;
}

module.exports = router;