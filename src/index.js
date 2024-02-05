import { getAirportData, handleSetDiscordPresence } from "./presence";
import { RPCClient as RPCLite, ProcMon } from "discord-presence-utils";
import "./types/AirportData";

// eslint-disable-next-line no-undef
const clientId = process.env["CLIENT_ID"] || __ESBUILD_GLOBAL_PROD_CLIENT_ID;
if (!clientId) throw new Error("identity crisis: missing clientId");

console.log(
  [
    "*".repeat(50),
    "Airport CEO Rich Presence - waiting for game to start...",
    "https://github.com/benjammin4dayz/aceo-discord-rpc",
    "",
    "Tip: If you run the game as admin, you must run this script as admin.",
  ].join("\n")
);

const client = new RPCLite();
const game = new ProcMon(["Airport CEO"]);
game.startup(); // stdby for game start

game.on("start", () => {
  const presenceObj = {
    client,
    getter: getAirportData,
    startTime: Date.now(),
  };

  client
    .connect(clientId)
    .then(() => {
      handleProcessEvents(client);
      handleSetDiscordPresence(presenceObj);
      setInterval(() => handleSetDiscordPresence(presenceObj), 1 * 60000);
    })
    .catch((e) => {
      console.error("An error has occurred:", e);
      process.exit(1);
    });
});

game.on("stop", async () => {
  await client.destroy();
});

function handleProcessEvents(client) {
  let isShutdown = false;
  const shutdown = () => {
    !isShutdown ? (isShutdown = true) : process.exit(1);
    client.clearActivity();
    client.destroy();
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
