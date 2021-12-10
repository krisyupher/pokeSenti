const express = require("express");
const global = require("../assets/global.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    "You are really ? Go to http://localhost:3000/pokeBattle/ with post"
  );
});

router.post("/", async (req, res) => {
  const pokeOne = req.body.fighter;
  const pokeTwo = req.body.opponent;
  try {
    const [pokemonOne, pokemonTwo] = await Promise.all([
      global.pokeDataByName(pokeOne),
      global.pokeDataByName(pokeTwo),
    ]);

    const result = await global.pokeBattleDamage(
      pokemonOne.data,
      pokemonTwo.data
    );
    res.json(result);
  } catch (error) {
    console.log("Error", error.response.status);
    res.status(error.response.status).json({
      ok: false,
      er: error.response.data,
    });
  }
});

module.exports = router;
