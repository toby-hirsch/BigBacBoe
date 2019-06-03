const express = require("express");

var games = require('../gamestore.js').games;

const router = express.Router();

// Display the dashboard page
router.get("/", (req, res) => {
	var game;
	var gamelist = [];
	console.log(res.locals.user);
	console.log(req.session);
	console.log('Checking if user is in games');
	for (key in games){
		if (games[key].players.black.user == res.locals.user.profile.login){
			console.log('Matched game ' + games[key].id + ' with color black');
			game = games[key];
			gamelist.push({opponent: game.players.red.user, id: game.id});
		}
		else if (games[key].players.red && games[key].players.red.user == res.locals.user.profile.login){
			console.log('Matched game ' + games[key].id + ' with color red');
			game = games[key];
			gamelist.push({opponent: game.players.black.user, id: game.id});
		}
	}
	
	res.render('dashboard', {
		gamelist: gamelist
	});
});


module.exports = router;