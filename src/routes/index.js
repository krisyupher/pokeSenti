const pokemonRouter = require("./pokemon.router");

function routerApi(app) {
  app.use("/pokeBattle", pokemonRouter);
}

module.exports = routerApi;

