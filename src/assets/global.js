const axios = require("axios");

/**
 *
 * @param {String} pokeName Nombre del pokemon a buscar
 * @returns Json Con la data del pokemon
 */
const pokeDataByName = (pokeName) => {
  return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
};
/**
 * peticion que trae la lista de las relaciones de daño de un pokemon
 * @param {string} pokeTypeUrl
 * @returns Json
 */
const pokeDataByType = (pokeTypeUrl) => {
  return axios.get(pokeTypeUrl);
};

/**
 * Esta funcion inicia la pelea entre los dos pokemones
 * @param {Object} pokeOneData los Json que devuelve la funcion pokeDataByName()
 * @param {Object} pokeTwoData  los Json que devuelve la funcion pokeDataByName()
 * @returns objeto final de con la informacion del ganador y estadistica de los oponentes
 */
const pokeBattleDamage = async (pokeOneData, pokeTwoData) => {
  const urlPokeOneData = pokeOneData.types.map((item) => item.type.url);
  const urlPokeTwoData = pokeTwoData.types.map((item) => item.type.url);
  let pokeOneDataByType = {}
  let pokeTwoDataByType = {}
  let pokeDataStatisticsOne = {};
  let pokeDataStatisticsTwo = {};
  try {
    pokeOneDataByType = await Promise.all(
      urlPokeOneData.map((item) => pokeDataByType(item))
    );
    pokeTwoDataByType = await Promise.all(
      urlPokeTwoData.map((item) => pokeDataByType(item))
    );
    pokeDataStatisticsOne = damageRelations(
      pokeOneData,
      pokeTwoData,
      pokeTwoDataByType
    );
    pokeDataStatisticsTwo = damageRelations(
      pokeTwoData,
      pokeOneData,
      pokeOneDataByType
    );
  } catch (error) {
    console.log("Error", error.response.status);
    res.status(error.response.status).json({
      ok: false,
      er: error.response.data,
    });
  }
  return {
    winner: winnerOrLoser(pokeDataStatisticsOne, pokeDataStatisticsTwo),
    fighterStatistic: pokeDataStatisticsOne,
    opponentStatistic: pokeDataStatisticsTwo,
    etc: "",
  };
};

/**
 * Esta funcion analiza que relaciones de daño aplican para cada pokemon
 * @param {Object} fighter json con la data del pokemon atacante pokeDataByName()
 * @param {Object} opponent json con la data del pokemon oponente pokeDataByName()
 * @param {Object} opponentTypes  json con la data de las relaciones de daño pokeDataByType()
 * @returns objeto con la lista de relaciones de daño
 */
const damageRelations = (fighter, opponent, opponentTypes) => {
  let affectedRelationship = [];
  let aux;
  fighter.types.forEach((typeOfFighter) =>
    opponentTypes.forEach((typeOfOpponents) => {
      Object.keys(typeOfOpponents.data.damage_relations).map((relation) => {
        if (typeOfOpponents.data.damage_relations[relation]) {
          aux = 0;
          aux = typeOfOpponents.data.damage_relations[relation].filter(
            (item) => typeOfFighter.type.name === item.name
          );
          if (aux.length) {
            affectedRelationship = [
              ...affectedRelationship,
              {
                fighterType: typeOfFighter.type.name,
                relation: relation,
                points: calculatePoints(relation),
              },
            ];
          }
        }
      });
    })
  );
  return {
    pokeName: opponent.name,
    pokeWeight: opponent.weight,
    statistics: affectedRelationship,
  };
};

/**
 * Esta funcion calcula el daño echo basado en el nombre del daño
 * @param {String} relation es el nombre de la relacion de daño
 * @returns pontaje parcial de daño
 */
const calculatePoints = (relation) => {
  switch (relation) {
    case "double_damage_from":
      return -70;
      break;

    case "double_damage_to":
      return +70;
      break;

    case "half_damage_from":
      return -30;
      break;

    case "half_damage_to":
      return +30;
      break;

    case "no_damage_from":
      return 0;
      break;

    case "no_damage_to":
      return 0;
      break;

    default:
      return 0;
      break;
  }
};

/**
 * Esta funcion determina cual es el ganador de la batalla
 * @param {Object} pokeDataStatisticsOne Objetos con las estadisticas damageRelations()
 * @param {Object} pokeDataStatisticsTwo Objetos con las estadisticas damageRelations()
 * @returns nombre del ganador
 */
const winnerOrLoser = (pokeDataStatisticsOne, pokeDataStatisticsTwo) => {
  let pokeOnePoints = 0;
  let pokeTwoPoints = 0;
  pokeDataStatisticsOne.statistics.map((item) => {
    pokeOnePoints += item.points;
  });
  pokeDataStatisticsTwo.statistics.map((item) => {
    pokeTwoPoints += item.points;
  });

  if (pokeOnePoints === pokeTwoPoints) {
    return { name: "tie", points: pokeOnePoints };
  } else {
    if (pokeOnePoints > pokeTwoPoints) {
      return {
        name: pokeDataStatisticsOne.pokeName,
        pointsWinner: pokeOnePoints,
        pointsLosser: pokeTwoPoints,
      };
    } else {
      return {
        name: pokeDataStatisticsTwo.pokeName,
        pointsWinner: pokeTwoPoints,
        pointsLosser: pokeOnePoints,
      };
    }
  }
};

module.exports = {
  pokeDataByName,
  pokeDataByType,
  pokeBattleDamage,
  damageRelations,
  calculatePoints,
  winnerOrLoser,
};
