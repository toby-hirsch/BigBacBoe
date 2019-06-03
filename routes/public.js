const express = require("express");


const router = express.Router();

// Home page
router.get("/", (req, res) => {
	console.log('get request to homepage');
	if (req.user)
		res.redirect('dashboard');
	else
		res.render("index");
});



module.exports = router;