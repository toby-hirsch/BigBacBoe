const express = require("express");


const router = express.Router();

// Home page
router.get("/", (req, res) => {
	if (req.user)
		res.redirect('dashboard');
	else
		res.render("index");
});


router.get('*', (req, res) => {
	res.status(404);
	res.render(error);
});
module.exports = router;