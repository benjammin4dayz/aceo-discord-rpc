import fs from "fs";
import os from "os";
import path from "path";

/**
 * Find the path where the user's game data is stored.
 * @param {"win32" | "linux" | "darwin"} platform Identifier for the active O.S.
 * @returns {string} Path to the user's save folder if it exists, otherwise an empty string.
 */
function findGameData(platform = os.platform()) {
  const vendorDir = path.join("Apoapsis Studios", "Airport CEO", "Saves");
  if (platform === "win32") {
    const roamingSaveDir = path.join(
      os.homedir(),
      "AppData",
      "Roaming",
      vendorDir
    );
    const localSaveDir = path.join(os.homedir(), "AppData", "Local", vendorDir);
    return fs.existsSync(roamingSaveDir)
      ? roamingSaveDir
      : fs.existsSync(localSaveDir)
      ? localSaveDir
      : "";
  }
}

/**
 * Search for the most recent save folder on the user's system and return the
 * path to a given file, or `GameData.json` by default.
 * @param {fs.PathLike} saveDir Base directory to search for save folders.
 * @param {string} file (optional): File override to read instead of `gameData.json`.
 * @returns {string} Absolute path to the most recent save, which is a file containing JSON data.
 */
function getLatestModifiedSaveFilePath(saveDir, file) {
  let latestMtimeMs = 0;
  let latestSaveDir = "";
  for (const file of fs.readdirSync(saveDir)) {
    if (!fs.statSync(path.join(saveDir, file)).isDirectory()) continue;
    const { mtimeMs } = fs.statSync(path.join(saveDir, file));
    if (mtimeMs > latestMtimeMs) {
      latestMtimeMs = mtimeMs;
      latestSaveDir = path.join(saveDir, file);
    }
  }
  const now = Date.now();
  const date = new Date(latestMtimeMs);
  const ts = date.toLocaleTimeString("en-US", { hour12: false });
  console.info(
    [
      `Last save: ${path.basename(latestSaveDir)}`,
      `(at ${ts}, ${Math.floor(
        (now - latestMtimeMs) / 1000 / 60
      )} minute(s) ago)`,
    ].join(" ")
  );
  if (file) return path.join(latestSaveDir, file);
  else return path.join(latestSaveDir, "GameData.json");
}

/**
 * Read and parse the save file into a valid JSON object.
 * @param {fs.PathLike} savePath Full path to a save file which contains valid JSON.
 * @returns Parsed JSON object representing the save file's contents.
 */
function jsonifySaveData(savePath) {
  let saveFile = "";
  let saveData = {};
  try {
    saveFile = fs.readFileSync(savePath, "utf-8");
  } catch {
    throw new Error("Unable to read save file");
  }
  try {
    saveData = JSON.parse(saveFile);
  } catch {
    throw new Error("Unable to parse save file");
  }
  return saveData;
}

export { findGameData, getLatestModifiedSaveFilePath, jsonifySaveData };
