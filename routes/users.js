const express = require("express");
const secured = require('../node_modules/secured');


const router = express.Router();

// Log a user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


/*router.get('/dashboard', function (req, res, next) {
	console.log(req.user);
	next();
});*/

router.get('/dashboard', secured(), function (req, res, next) {
	const { _raw, _json, ...userProfile } = req.user;
	console.log('User');
	console.log(req.user);
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

router.get('*', (req, res) => {
	res.render('error');
});



module.exports = router;