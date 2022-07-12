require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const POKEDEX = require("./pokedex.json");

const app = express();

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

const validTypes = [
	`Bug`,
	`Dark`,
	`Dragon`,
	`Electric`,
	`Fairy`,
	`Fighting`,
	`Fire`,
	`Flying`,
	`Ghost`,
	`Grass`,
	`Ground`,
	`Ice`,
	`Normal`,
	`Poison`,
	`Psychic`,
	`Rock`,
	`Steel`,
	`Water`,
];

function handleGetTypes(req, res) {
	res.json(validTypes);
}

app.use(function validateBearerToken(req, res, next) {
	const apiToken = process.env.API_TOKEN;
	const authToken = req.get("Authorization");

	if (!authToken || authToken.split(" ")[1] !== apiToken) {
		return res.status(401).json({ error: "Unauthorized request" });
	}

	// move to the next middleware
	next();
});

app.get("/types", function handleGetTypes(req, res) {
	res.json(validTypes);
});

app.get("/pokemon", function handleGetPokemon(req, res) {
	let response = POKEDEX.pokemon;

	// filter our pokemon by name if name query param is present
	if (req.query.name) {
		response = response.filter((pokemon) =>
			pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
		);
	}

	if (req.query.type) {
		respomse = response.filter((pokemon) =>
			pokemon.type.includes(req.query.type)
		);
	}

	res.json(response);
});

function handleGetPokemon(req, res) {
	res.send("Hello, Pokemon!");
}

app.get("/pokemon", handleGetPokemon);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
