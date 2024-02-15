var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt');
const uid2 = require('uid2');


router.post("/signup", function (req, res) {
  const { firstname, username, password } = req.body;

	const result = checkBody(req.body, ["firstname", "username", "password"]);
	if (!result) return res.json({ result: false, error: "Champs manquants ou vides" });

	User.findOne({ username: username.toLowerCase() })
		.then((data) => {
			if (data) return res.json({ result: false, error: "Utilisateur déjà existant" });
			const hash = bcrypt.hashSync(password, 10);
			const newUser = new User({
        firstname,
        username,
        password: hash,
        token: uid2(32),
      });

			newUser
				.save()
				.then(() => {
					return res.json({ result: true, user: newUser.username, token: newUser.token });
				})
				.catch((e) => {
					console.error(e);
					return res.json({ result: false, error: "Erreur serveur" });
				});
		})
		.catch((e) => {
			console.error(e);
			return res.json({ result: false, error: "Erreur serveur" });
		});
});


router.post("/signin", function (req, res) {
	const { username, password } = req.body;

	const result = checkBody(req.body, ["username", "password"]);
	if (!result) return res.json({ result: false, error: "Champs manquants ou vides" });

	User.findOne({ username })
		.then((data) => {
			if (!data) return res.json({ result: false, error: "Utilisateur non existant" });

			const pwdMatch = bcrypt.compareSync(password, data.password);
			if (!pwdMatch) return res.json({ result: false, error: "Mot de passe incorrect" });

			return res.json({ result: true, user: data.username, token: data.token  });
		})
		.catch((e) => {
			console.error(e);
			return res.json({ result: false, error: "Erreur serveur" });
		});
});


module.exports = router;
