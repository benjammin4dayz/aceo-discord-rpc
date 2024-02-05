import {
  findGameData,
  getLatestModifiedSaveFilePath,
  jsonifySaveData,
} from "./saveUtil";
import "./types/AirportData";

/**
 * Set the relevant Discord Presence according to the game state.
 * @param {Object} param0 - Object containing the parameters
 * @param {RPCClient} param0.client - Discord RPC client
 * @param {function(): AirportData} param0.getter - Getter function which is responsible for retrieving 'fresh' data
 * @param {number} param0.startTime - Unix timestamp representative of the process start time
 * @returns {void}
 *
 * @example
 * Playing Airport CEO
 * LaGuardia Airport (LGA)
 * 🛩️ 69420 |✈️ 690 | ⭐ 4.2
 * 15 minutes elapsed
 */
function handleSetDiscordPresence({ client, getter, startTime }) {
  const airportData = getter();
  const {
    airportIATACode,
    airportName,
    nbrProcessedGAFlights,
    nbrProcessedCommercialFlighs,
    currentAirportRating,
    day,
    year,
    funds,
    icao,
    loanPayback,
  } = airportData;

  console.log("Updating presence...");

  client.setActivity({
    details: `${airportName} (${icao}${airportIATACode})`,
    state: `🛩️${nbrProcessedGAFlights} |✈️${nbrProcessedCommercialFlighs} |⭐${
      ((currentAirportRating * 100) / 20).toFixed(1) || 0
    }`,
    largeImageKey: "game_logo",
    largeImageText: `📅Y${year}D${day} |💲${Math.floor(funds)} (-${
      Math.floor(loanPayback) || 0
    })`,
    startTimestamp: startTime,
  });
}

/**
 * Retrieves airport data.
 * @returns {AirportData} Object containing airport data.
 */
function getAirportData() {
  const savedGamesDir = findGameData();
  const mostRecentSavePath = getLatestModifiedSaveFilePath(savedGamesDir);
  const {
    playerSessionProfileData,
    airportData,
    airportRatingData,
    economyData,
  } = jsonifySaveData(mostRecentSavePath);

  const { airportIATACode, airportName, icao } =
    playerSessionProfileData.playerAirport;
  const { nbrProcessedGAFlights, nbrProcessedCommercialFlighs } = airportData;
  const { currentAirportRating } = airportRatingData;
  const { day, year } = playerSessionProfileData.playerWorldTimeData.worldTime;
  const { funds, loanPayback } = economyData;

  return {
    airportIATACode,
    airportName,
    nbrProcessedGAFlights,
    nbrProcessedCommercialFlighs,
    currentAirportRating,
    day,
    year,
    funds,
    icao,
    loanPayback,
  };
}

export { handleSetDiscordPresence, getAirportData };
